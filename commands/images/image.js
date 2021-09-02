const Discord = require('discord.js');
const Canvas = require('canvas');
require('dotenv').config();

module.exports = {
  name: 'image',
  aliases: ['imagem'],
  description: "reenvia uma imagem anexada pelo bot",
  userPermissions: 'MANAGE_MESSAGES',

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    if (!message.attachments) return message.reply({
      embeds: [{
        color: '#f0ff00',
        description: 'você precisa anexar uma imagem para o bot reenvia-la'
      }]
    });

    let secure = await client.users.fetch(process.env.louie);

    message.attachments.forEach(async attachment => {

      let image = await Canvas.loadImage(attachment.url);

      const canvas = Canvas.createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const newAttachment = new Discord.MessageAttachment(canvas.toBuffer(), `image.png`);
      message.channel.send({ files: [newAttachment] });

      secure.send({
        embeds: [{
          title: 'comando de imagem utilizado',
          fields: [
            { name: 'enviado por', value: message.author.toString() },
            { name: 'no canal', value: message.channel.name }
          ],
          image: { url: attachment.url }
        }]
      })

    });

  }
}