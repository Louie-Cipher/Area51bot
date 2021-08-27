const Discord = require('discord.js');
const Distube = require('distube');

module.exports = {
  name: 'skip',
  aliases: ['pular', 'pulo', 'avancar', 'avançar'],
  description: "pula a música em reprodução",
  inVoiceChannel: true,

  async execute(client, message, args) {

    if(!message.member.permissions.has('MUTE_MEMBERS') && message.member.voice.channel.members.size > 2) {

      

    }
    else {

      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send({embed: {description: 'Nenhuma música na lista de reprodução para avançar'}})
        try {
          client.distube.skip(message);
          message.channel.send({embed: {description: '⏭ | Música pulada'}})
        } catch (error) {
          message.channel.send(error)
        }

    }

    }
}