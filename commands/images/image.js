const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  name: 'image',
  aliases: ['imagem'],
  description: "reenvia uma imagem anexada pelo bot",

  async execute(client, message, args) {

    if(!message.attachments[0]) return message.channel.send({embed: {
      color: '#f0ff00',
      description: 'você precisa anexar uma imagem para o bot reenvia-la'
    }});

    let image = await Canvas.loadImage(message.attachments[0]);

    const canvas = Canvas.createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);


  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `image.png`);
    message.channel.send(attachment);

  }
}