const Discord = require('discord.js');
const Distube = require('distube');

module.exports = {
  name: 'play',
  aliases: ['p', 'add'],
  description: "reproduz uma música com um link do youtube",
  inVoiceChannel: true,

  async execute(client, message, args) {

    if (!args) return message.reply('Insira o nome da música ou um link do youtube após o comando');

    const music = args.join(" ");

    client.distube.play(message, music);

  }
}