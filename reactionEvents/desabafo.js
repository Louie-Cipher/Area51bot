const Discord = require('discord.js')

module.exports = async (client, reaction, user) => {

  if (reaction.users.cache.size > 2) return;

  let aproveMessage = await reaction.message.embeds[0];

  let desabafoChannel = await client.channels.fetch('880547715245809714');

  let desabafoEmbed = new Discord.MessageEmbed()
    .setColor('#bababa')
    .setTitle('💭 Desabafo')
    .setDescription(aproveMessage.description);

  desabafoChannel.send({content: [desabafoEmbed]});

}