const Discord = require('discord.js')

module.exports = async (client, reaction, user) => {

  if (reaction.users.cache.size > 2) return;

  let aproveMessage = await reaction.message.embeds[0];

  let correioChannel = await client.channels.fetch('873050670775816243');

  let emojis = [
    '💖', '💞', '❤️', '💝', '💘', '💕', '💓', '💗', '💞', '💜', '💟', '💑', '😘', '😚',
    '<a:q_ursofofos:873608974707077130>',
    '<a:a_pinkshyblush:744677972749058148>',
    '<:a_ursoapaixonadinha:873608592899604540>',
    '<:q_ursoapaixonado:873608834579587092>',
    '<a:br_hz_bear:873609226356949064>',
    '<a:red_corii:873593052621586442>',
    '<a:fof:833818497519583253>',
    '<:r_rfe:873608399382781994>',
    '<a:rx_hz2:873610787162312775>',
    '<a:r_rfe:873593450388422666>'
  ];

  let emojiRand = emojis[Math.floor(Math.random() * emojis.length)];

  let correioEmbed = new Discord.MessageEmbed()
    .setColor('#ff00a2')
    .setTitle('Correio amoroso')

  correioChannel.send(correioEmbed);
  let correioMessage = await correioChannel.send(aproveMessage.description)
  correioMessage.react(emojiRand);

}