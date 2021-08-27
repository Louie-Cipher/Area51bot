const Discord = require('discord.js');
const Distube = require('distube');

module.exports = {
  name: 'filter',
  aliases: ['filters', 'filtro', 'efeito'],
  description: "adciona um filtro de áudio ao player de música",
  inVoiceChannel: true,
  booster: true,

  async execute(client, message, args) {

    let embed = new Discord.MessageEmbed()
      .setColor('#00ff50')
      .setTitle('Insira o nome do filtro após o comando')
      .setDescription(
        `**exemplo: a.filter vaporwave**
        3d
        bassboost
        echo
        karaoke
        nightcore
        vaporwave
        flanger
        gate
        haas
        reverse
        surround
        mcompand
        phaser
        tremolo
        earwax`)

    if (!args[0]) return message.channel.send(embed)

    /*const filterName = args[0]
    client.distube.setFilter(message, filterName);*/

    const queue = client.distube.getQueue(message)

    if (!queue) return message.channel.send(
      {embed: {title: 'Não há nenhuma música sendo reproduzida agora', description: 'adcione uma música primeiro para usar um filtro de música'}}
      );

    if (args[0] === "off" && queue.filter) client.distube.setFilter(message, queue.filter)
    else if (Object.keys(client.distube.filters).includes(args[0])) client.distube.setFilter(message, args[0])
    else if (args[0]) return message.channel.send('Filtro inválido')

    message.channel.send(
      {embed: {title: 'Filtro selecionado:', description: `${queue.filter || "Off"}`}}
      );

  }
}