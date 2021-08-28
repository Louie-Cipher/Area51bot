const Discord = require("discord.js");
const system = require('systeminformation');
const profileModel = require('../../mongoSchema/profile');
const package = require('../../package.json');

module.exports = {
  name: 'botinfo',
  aliases: ['bot', 'stats'],
  description: "exibe informações úteis e status do bot",

  /** 
  * @param {Discord.Client} client
  * @param {Discord.Message} message
  * @param {String[]} args
  */

  async execute(client, message, args) {

    let totalProfiles = await profileModel.countDocuments();
    let dbSize;

    await profileModel.collection.stats(function(err, results) {
        dbSize = results.storageSize
    });

    const readyAt = new Date(client.readyAt.getTime() + 10800000);
    const readyString = `${readyAt.getDate()}/${readyAt.getMonth() + 1}/${readyAt.getDate()} - ${readyAt.getHours()}:${readyAt.getMinutes()}`

    let cpu = await system.cpu();
    let ram = await system.mem();
    let os = await system.osInfo();

    let embed = new Discord.MessageEmbed()
        .setColor('#00ff30')
        .setTitle('Informações do bot')
        .setDescription('Aqui estão algumas informações úteis sobre mim')
        .addFields(
            {name: '⏰ Online desde', value: readyString, inline: true},
            {name: 'Versão do Discord.js', value: package.dependencies["discord.js"], inline: true},
            //{name: 'Versão do NodeJS', value: '', inline: true},
            {name: '🏦 Banco de dados 🎲', value: `${totalProfiles} usuários\n${dbSize} Kb`},
            {name: '🖥 Uso de CPU', value: `${cpu.cores} cores\n${cpu.speed} GHz`, inline: true},
            {name: '🖥 Uso de RAM', value: `${ram.used}`, inline: true},
            {name: '🖥 OS', value: os.logofile, inline: true},
        );

    
    message.reply(embed)

  }
}