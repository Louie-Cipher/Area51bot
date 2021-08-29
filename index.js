const Discord = require('discord.js');
const DisTube = require('distube');
const fs = require('fs');

const lotteryDB = require('./mongoSchema/lottery');

const prefix = 'a.';

const client = new Discord.Client({partials: ['CHANNEL', 'MESSAGE', 'GUILD_MEMBER', 'REACTION']});
client.distube = new DisTube(client, {
	searchSongs: false,
	emitNewSongOnly: true,
	leaveOnFinish: false,
  leaveOnEmpty: false
});

require('./distubeEvents').events(client.distube);
require('./mongoose').init();

client.commands = new Discord.Collection();

const mainFolderCommands = fs.readdirSync('./commands');

for (const subFolder of mainFolderCommands) {

  let categoryFolder = fs.readdirSync(`./commands/${subFolder}`);

  for (const file of categoryFolder) {
    if (file.endsWith('.js')) {
      let cmd = require(`./commands/${subFolder}/${file}`);
      client.commands.set(cmd.name, cmd);
    }
  }

};

client.on('ready', async () => {

	console.log('|    Comandos' + ' '.repeat(4) + '|Status|');
	client.commands.forEach(cmd => {
		console.log(
      '\x1b[4m%s\x1b[0m', '| ' + cmd.name + ' '.repeat( 15 - cmd.name.length ) + '| ✅ |'
    )
	});
	console.log(`\n|| ${client.user.tag} online! ||`);

	const activities = [
		`Utilize ${prefix}help para uma lista com meus comandos (ou pergunte à Louie)`,
		`Olá, eu sou o bot oficial do servidor Área 51`,
		`${client.users.cache.size} membros no servidor`
	];

  let i = 0;
	setInterval( () => {

    client.user.setActivity( `${activities[i]}`, {type: 'PLAYING'} );
    i++;
    if (i==3) {i = 0}

  } , 1000 * 20);

  setInterval( async () => {

    let dateNow = new Date();

    if (dateNow.getHours() == 0 && dateNow.getMinutes() == 0) {

      let lotteryData = lotteryDB.findOne({true: true});

      let lastSort = new Date(lotteryData.lastSort);

      if ( lastSort.getDate() != dateNow.getDate() ) {

        require('./extra/sorteio.js').execute(client);

      }

    }

  } , 1000 * 20);

  /*setInterval(
		() =>
			require('./voicexp').voiceXpAdd(client),
		1000 * 10
  );*/

});

client.on('message', async message => {
  require('./events/message').event(client, message);
});

client.on("voiceStateUpdate", async function (oldState, newState) {
  require('./events/voiceStateUpdate').event(client, oldState, newState);
});

client.on("messageReactionAdd", async function (reaction, user) {
  require('./events/messageReactionAdd').event(client, reaction, user);
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/*
async function perguntas() {
  let randomTime = Math.floor(Math.random() * 1000 * 60) + 120 * 1000
}

/*
async function voiceXPloop(client) {
  while (true) {
    await delay(1000 * 15);
    require('./voicexp').voiceXpAdd(client);
  }
}

voiceXPloop(client);
*/

client.login(process.env['BOT_TOKEN']);