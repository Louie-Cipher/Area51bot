const Discord = require('discord.js');
const Distube = require('distube');

module.exports = {
  name: 'lofi',
  aliases: ['lo-fi'],
  description: "toca a rádio lo-fi girl",
  inVoiceChannel: true,

  async execute(client, message, args) {

    client.distube.play(message, 'https://www.youtube.com/watch?v=5qap5aO4i9A');

  }
}