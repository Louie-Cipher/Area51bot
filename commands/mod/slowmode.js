const Discord = require("discord.js");

module.exports = {
  name: 'slowmode',
  aliases: ['modolento', 'slow', 'ratelimit'],
  description: 'define um intervalo de tempo que os membros precisam esperar para enviar novas mensagens',
  userPermissions: 'MANAGE_CHANNELS',

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    let embed = new Discord.MessageEmbed()
      .setColor('para definir o modo lento nesse canal')
      .setTitle('use a.slowmode <segundos> <motivo>')
      .setDescription(`exemplo: a.slowmode 5 muitas mensagens
        use 0 para desativar o modo lento`)
      .setFooter('(motivo é opcional)');

    if (!args[0]) return message.reply({ embeds: [embed] })

    const time = parseInt(args[0], 10);

    message.channel.setRateLimitPerUser(time, `por: ${message.author.id}`)

    let mode = `ativado. tempo: ${time}`
    if (time == 0) mode = 'desativado'

    message.reply({ embeds: [{ description: `modo lento do canal ${mode}` }] })

  }
}