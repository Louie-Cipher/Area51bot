const Discord = require('discord.js');

module.exports = {
  name: 'emoji',
  aliases: ['falar', 'dizer', 'enviar'],
  description: "para reenviar ",
  userPermissions: 'MANAGE_MESSAGES',

  async execute(client, message, args) {

    if(!args[0]) return message.channel.send(
      'escreva o nome ou id do emoji que deseja enviar junto com o comando');

    if(args[0].length == 18) {
      let emoji = await message.guild.emojis.cache.get(args[0]);
    } else {
      let emoji = await message.guild.emojis.cache.get(emojiName => emoji.name(args[0]));
    }
    if(!emoji) return message.channel.send('emoji não encontrado')
    

    message.channel.send(emoji);


  }
}