const Discord = require("discord.js");

module.exports = {
  name: 'avatar',
  aliases: ['icon', 'foto'],
  description: "mostra o avatar de um usuário",

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;


    let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 });

    let embed = new Discord.MessageEmbed()
      .setColor(`#efefef`)
      .setTitle(`Avatar de ${user.username}`)
      .setImage(avatar)
      .setFooter(`• requisitado por: ${message.author.tag}`, message.author.displayAvatarURL({ format: "png" }));
    await message.channel.send(embed);

  }
}