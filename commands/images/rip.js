const canvacord = require("canvacord");
const Discord = require('discord.js');

module.exports = {
  name: 'rip',
  aliases: ['morto', 'f'],
  description: "adciona o efeito RIP em uma imagem",

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
    let image = await canvacord.Canvas.rip(avatar);
    let attachment = new Discord.MessageAttachment(image, `wasted.gif`);
    message.channel.send(attachment);

  }
}