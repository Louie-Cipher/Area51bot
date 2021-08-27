const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'profile',
  aliases: ['perfil', 'xp'],
  description: "exibe o seu perfil no bot, com seu nível de XP e Star coins",

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (args[0] && !user)
      return message.channel.send({embed: {color: '#b3c20c', title: 'usuário informado não encontrado'}})

    if(!user) user = message.author

    if (user.bot)
      return message.channel.send(
        {embed: { title: `${user.tag}` , description: 'Bip Bop | Bots não possuem rank de XP ou um perfil no Area51Bot' }}
      );

    var member = message.guild.members.cache.get(user.id);

    profileData = await profileModel.findOne({userID: user.id});

    if (!profileData) return message.channel.send({embed: {color: '#009999', title: 'Esse usuário ainda não possui um perfil no Area51Bot', description: 'um perfil será criado automaticamente após o usuário enviar uma mensagem pela primeira vez'}});

    let embed = new Discord.MessageEmbed()
      .setColor('#00ff00')
      .setTitle(`${user.tag}`)
      .addFields(
        {name: 'XP por texto', value: profileData.chatXP},
        {name: 'XP por voz', value: profileData.voiceXP}
      );

    message.channel.send(embed);
  }
}