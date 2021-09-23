const Discord = require('discord.js');



module.exports = async (client, reaction, user) => {

  if (reaction.users.cache.size > 2) return;

  let aproveMessage = await reaction.message.embeds[0];

  let correioChannel = await client.channels.fetch('873050670775816243');

  let emojis = [
    '💖', '💞', '❤️', '💝', '💘', '💕', '💓', '💗', '💞', '💜', '💟', '💑', '😘', '😚',
  ];

  let emojiRand = emojis[Math.floor(Math.random() * emojis.length)];

  let correioEmbed = new Discord.MessageEmbed()
    .setColor('BLURPLE')
    .setTitle('Correio amoroso')

  correioChannel.send({embeds: [correioEmbed]});
  let correioMessage = await correioChannel.send({content: aproveMessage.description})
  correioMessage.react(emojiRand);

}