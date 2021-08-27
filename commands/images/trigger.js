const canvacord = require("canvacord");
const Discord = require('discord.js');

module.exports = {
  name: 'trigger',
  aliases: ['triggered'],
  description: "adciona o efeito TRIGGERED em uma imagem",

  async execute(client, message, args) {

    /*if(args[0]) {
      const emoji = message.guild.emojis.cache.first();
      //console.log(emoji);
      const emojiUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.png`
      console.log(emojiUrl);
      const image = await canvacord.Canvas.trigger(emojiUrl);
    }
    if (!args[0]) {*/
    let user = message.mentions.users.first() || message.author;
    let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
    let image = await canvacord.Canvas.trigger(avatar);
    //}
    
    let attachment = new Discord.MessageAttachment(image, `triggered.gif`);
    message.channel.send(attachment);

  }
}