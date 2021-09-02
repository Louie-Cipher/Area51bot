const Canvas = require("canvas");
const Discord = require('discord.js');

module.exports = {
  name: 'morrepraga',
  aliases: ['praga',],
  description: "gera uma imagem do meme 'morre praga' com o usuário informado ",

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0])

    if (args[0] && !user) return message.reply({content: 'usuário informado não encontrado'});
    if (!user) user = message.author;

    const avatar = await Canvas.loadImage(user.displayAvatarURL({dynamic: false, format: 'jpg'}));

    const template = await Canvas.loadImage('https://feijoadasimulator.top/br/templates/1814.png');

    const canvas = Canvas.createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(avatar, 140, 200, 200, 200);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `morrepraga.png`);
    message.reply({files: [attachment]});

  }
}