const Discord = require("discord.js");

module.exports = {
  name: 'kick',
  aliases: ['expulsar'],
  description: "expulsa o usuário mencionado do servidor",
  userPermissions: 'KICK_MEMBERS',

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    let member = message.guild.member(user);

    if(!args[0]) return message.channel.send('Mencione alguém para expulsar do servidor.');

    if(!member) return message.channel.send('Membro não encontrado.');

    
    
  }
}