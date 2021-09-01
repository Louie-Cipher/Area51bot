const Discord = require('discord.js');
const DisTube = require('distube');
const fs = require('fs');

const lotteryDB = require('./mongoSchema/lottery');

const { prefix } = require('./config.json');

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS
  ]
});

client.distube = new DisTube(client, {
  searchSongs: false,
  emitNewSongOnly: true,
  leaveOnFinish: false,
  leaveOnEmpty: false
});

require('./distubeEvents').events(client.distube);
require('./mongoose').init();

client.commands = new Discord.Collection();

const mainCommandsFolder = fs.readdirSync('./commands');

for (const subFolder of mainCommandsFolder) {

  let categoryFolder = fs.readdirSync(`./commands/${subFolder}`).filter(file => file.endsWith('.js'));

  for (const file of categoryFolder) {
    let cmd = require(`./commands/${subFolder}/${file}`);
    client.commands.set(cmd.name, cmd);
  }
};

client.slashCommands = new Discord.Collection();

const slashCommandsFolder = fs.readdirSync('./slashCommands');

for (const subFolder of slashCommandsFolder) {

  let categoryFolder = fs.readdirSync(`./slashCommands/${subFolder}`).filter(file => file.endsWith('.js'));

  for (const file of categoryFolder) {
    let cmd = require(`./slashCommands/${subFolder}/${file}`);
    client.slashCommands.set(cmd.name, cmd);
  }
};

let invitesMap = new Discord.Collection();

client.on('ready', async () => {

  console.log('|    Comandos    |Status|');
  client.commands.forEach(cmd => {
    console.log(
      '\x1b[4m%s\x1b[0m', '| ' + cmd.name + ' '.repeat(15 - cmd.name.length) + '| ✅ |'
    )
  });
  console.log(`\n|| ${client.user.tag} online! ||`);

  let guild = await client.guilds.cache.get('768565432663539723');

  let invites = await guild.invites.fetch();

  invites.forEach(invite => {
    invitesMap.set(invite.code, invite);
  });

  module.exports = { client, invitesMap }

  const activities = [
    `Utilize ${prefix}help para uma lista com meus comandos (ou pergunte à Louie)`,
    `Olá, eu sou o bot oficial do servidor Área 51`,
    `${client.users.cache.size} membros no servidor`
  ];

  let i = 0;
  setInterval(() => {

    client.user.setActivity(`${activities[i]}`, { type: 'PLAYING' });
    i++;
    if (i == 3) { i = 0 }

  }, 1000 * 20);

  setInterval(async () => {

    let dateNow = new Date();

    if (dateNow.getHours() == 0 && dateNow.getMinutes() == 0) {

      let lotteryData = await lotteryDB.findOne({ true: true });

      let lastSort = new Date(lotteryData.lastSort);

      if (lastSort.getDate() != dateNow.getDate()) {

        require('./extra/sorteio.js').execute(client);

      }

    }

  }, 1000 * 20);

  setInterval(
    () =>
      require('./extra/voicexp').voiceXpAdd(client),
    1000 * 60 * 5
  );

});

client.on('message', async message => {
  require('./events/message').event(client, message);
});

client.on('interactionCreate', async function (interaction) {
  require('./events/interactionCreate').event(client, interaction)
})

client.on("voiceStateUpdate", async function (oldState, newState) {
  require('./events/voiceStateUpdate').event(client, oldState, newState);
});

client.on("messageReactionAdd", async function (reaction, user) {
  require('./events/messageReactionAdd').event(client, reaction, user);
});

client.on('guildMemberUpdate', async function (oldMember, newMember) {
  require('./events/messageReactionAdd').event(client, oldMember, newMember);
});

client.on('guildMemberAdd', async function (member) {
  require('./extra/inviteTracker').event(client, member)
});

client.on('guildMemberRemove', async function (member) {
  require('./events/guildMemberRemove').event(client, member)
});

client.login(process.env['BOT_TOKEN']);