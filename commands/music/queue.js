const Discord = require('discord.js');
const Distube = require('distube');

module.exports = {
  name: 'queue',
  aliases: ['playlist'],
  description: "mostra as músicas na lista de reprodução atual",

  async execute(client, message, args) {

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send( {embed: {title: 'Nenhuma música na fila de reprodução'} });

    const q = queue.songs.map((song, i) => `${i === 0 ? "**Reproduzindo agora:**\n" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``).join("\n")
      
    let embed = new Discord.MessageEmbed()
      .setColor('#00ff30')
      .setTitle('Fila de reprodução')
      .setDescription(q);

    message.channel.send(embed)

  }
}