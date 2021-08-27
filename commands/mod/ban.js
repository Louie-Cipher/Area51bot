const Discord = require("discord.js");

module.exports = {
  name: 'ban',
  aliases: ['hackban', 'banir'],
  description: "bane o usuário mencionado do servidor",
  userPermissions: 'BAN_MEMBERS',

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if(!args[0]) return message.channel.send('Mencione ou informe o ID de alguém para banir.');
    if(!user) return message.channel.send('Usuário informado não encontrado.');

    let member = message.guild.members.fetch(user);

    if(!member) return message.channel.send('Membro não encontrado ou não está no servidor.');

    if(args[1]){
      const banReason = args.join(' ').split(user)[0];
      const daysDelete = args.join(' ').split('|')[1];
    }

    let logEmbed = new Discord.MessageEmbed()
      .setColor('#ff1000')
      .setTitle('Membro banido')
      .addFields(
        {name: 'usuário banido', value: `${user.tag}`},
        {name: 'ID', value: `${user.id}`},
        {name: 'mensagens do usuário apagadas', value: `últimos ${daysDelete} dias`},
        {name: 'banido por', value: `${message.author}`}
      )
    
    message.channel.send(logEmbed);

    
    
  }
}