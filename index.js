const Discord = require('discord.js');
//const DisTube = require('distube');
const fs = require('fs');
require('dotenv').config();
const lotteryDB = require('./mongoSchema/lottery');
const { prefix } = require('./config.json');

const client = new Discord.Client({
    intents: 8191
});

/*client.distube = new DisTube(client, {
    searchSongs: false,
    emitNewSongOnly: true,
    leaveOnFinish: false,
    leaveOnEmpty: false
});*/

//require('./distubeEvents').events(client.distube);
require('./mongoose').init();

client.commands = new Discord.Collection();

const mainCommandsFolder = fs.readdirSync('./commands');

for (const subFolder of mainCommandsFolder) {
    if (subFolder.includes('music')) break;
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

    let invites = await guild.invites.fetch()

    invites.forEach(invite => {
        invitesMap.set(invite.code, invite);
    });

    module.exports = { invitesMap }

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

client
    .on('messageCreate', async message => {
        try {
            require('./events/messageCreate')(client, message);
        } catch (error) {
            console.error(error)
        }
    })
    .on('interactionCreate', async interaction => {
        try {
            require('./events/interactionCreate')(client, interaction);
        } catch (error) {
            console.error(error)
        }
    })
    .on("voiceStateUpdate", async (oldState, newState) => {
        try {
            require('./events/voiceStateUpdate')(client, oldState, newState);
        } catch (error) {
            console.error(error)
        }
    })
    .on("messageReactionAdd", async (reaction, user) => {
        try {
            require('./events/messageReactionAdd')(client, reaction, user);
        } catch (error) {
            console.error(error)
        }
    })
    .on('guildMemberAdd', async member => {
        try {
            require('./extra/inviteTracker').guildMemberAdd(client, member);
        } catch (error) {
            console.error(error)
        }
    })
    .on('inviteDelete', async invite => {
        try {
            require('./extra/inviteTracker').inviteDelete(client, invite);
        } catch (error) {
            console.error(error)
        }
    })
    .on('inviteCreate', async invite => {
        try {
            require('./extra/inviteTracker').inviteCreate(client, invite);
        } catch (error) {
            console.error(error)
        }
    });

client.login(process.env['BOT_TOKEN']);