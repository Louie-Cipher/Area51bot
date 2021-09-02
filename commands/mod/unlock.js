const Discord = require("discord.js");

module.exports = {
  name: 'unlock',
  aliases: ['abrir', 'destravar'],
  description: 'restaura a permissão de "@everyone" (ou o membro/cargo informado) enviar mensagens no chat',
  userPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    let target;

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (user) target = user;

    let role = message.guild.roles.cache.get(args[0])

    if (role) target = role;

    if (target != undefined) {
      message.channel.permissionOverwrites.set([
        {
          id: role.id,
          null: [Discord.Permissions.FLAGS.SEND_MESSAGES],
        },
      ], 'por: ' + message.member.id);

    } else {
      message.channel.permissionOverwrites.set([
        {
          id: message.guild.roles.everyone.id,
          null: [Discord.Permissions.FLAGS.SEND_MESSAGES],
        },
      ], 'por: ' + message.member.id);
      target = '@ everyone'
    }

    const embed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Canal desbloqueado com sucesso!')
      .setDescription(`agora "${target}" pode(m) voltar a enviar mensagens nesse canal`);

    message.reply({ embeds: [embed] });

  }
}