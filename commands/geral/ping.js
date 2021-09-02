const Discord = require("discord.js");

module.exports = {
  name: 'ping',
  aliases: ['teste', 'speed'],
  description: "testa a Latência do bot",

  /**
   * 
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    let pong = await message.reply({
      embeds: [{
        color: 39423,
        title: "Ping"
      }]
    });

    let embed = new Discord.MessageEmbed()
      .setColor('#00ff00')
      .setTitle('🏓 | Pong!')
      .addFields(
        { name: 'Latência do Server:', value: `${pong.createdTimestamp - message.createdTimestamp}ms` },
        { name: 'Latência da API:', value: `${Math.round(client.ws.ping)}ms` }
      );

    pong.edit({ embeds: [embed] });

  }
}