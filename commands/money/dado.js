const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'dado',
  aliases: ['dice'],
  description: "rola um dado com o número de lados especificado",

  async execute(client, message, args) {

    return message.channel.send('Comando em construção...');

  }
}