const Discord = require('discord.js');
const Distube = require('distube');

module.exports = {
  name: 'stop',
  aliases: ['disconect', 'dc'],
  description: "para a reprodução de música e desconecta o bot do canal de voz",
  inVoiceChannel: true,

  async execute(client, message, args) {

    if(!message.member.permissions.has('MUTE_MEMBERS') && message.member.voice.channel.members.size > 2)
      return message.channel.send({embed: {color: '#ff0000', description: '❌ | Você precisa estar sozinho com o bot no canal de voz para conseguir desconecta-lo da call'}});

    client.distube.stop(message);

    message.channel.send({embed: {color: '#00ff50', description: '⏹ | Parando a reprodução de música'}});

  }
}