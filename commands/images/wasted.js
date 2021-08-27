const canvacord = require("canvacord");
const Discord = require('discord.js');

module.exports = {
  name: 'wasted',
  aliases: ['gta'],
  description: "adciona o efeito wasted de GTA em uma imagem",

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
    let image = await canvacord.Canvas.wasted(avatar);
    let attachment = new Discord.MessageAttachment(image, `wasted.png`);
    message.channel.send(attachment);

  }
}