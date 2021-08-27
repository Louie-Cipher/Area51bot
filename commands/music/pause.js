const Discord = require('discord.js');
const Distube = require('distube');

module.exports = {
  name: 'pause',
  aliases: ['pausa', 'pausar', 'resume'],
  description: "pausa a música em reprodução",
  inVoiceChannel: true,

  async execute(client, message, args) {

    const queue = client.distube.getQueue(message)

    if (!queue) return message.channel.send(`Não há nenhuma música sendo reproduzida nesse momento.`);
    if (queue.pause) {
      client.distube.resume(message)
        return message.channel.send({embed: {description: '⏯ | Continuando a reprodução'}});
    }

    client.distube.pause(message);
    message.channel.send({embed: {description: '⏸ | Música pausada'}});

  }
}