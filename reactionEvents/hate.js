const Discord = require('discord.js')

module.exports = {

  async trigger(client, reaction, user) {

    if(reaction.users.cache.size > 2) return;

    let aproveMessage = await reaction.message.embeds[0];

    let correioChannel = await client.channels.fetch('874146095331176529');

    let emojis = [
      '🤬', '😡', ''
    ];
    let emojiRand = emojis[Math.floor(Math.random() * emojis.length)];

    let correioEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Correio do ódio')

    correioChannel.send(correioEmbed);
    let correioMessage = await correioChannel.send(aproveMessage.description)
    //correioMessage.react(emojiRand);

  }
}