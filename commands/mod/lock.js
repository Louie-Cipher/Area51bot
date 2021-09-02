const Discord = require("discord.js");

module.exports = {
  name: 'lock',
  aliases: ['fechar', 'travar', 'block', 'bloquear'],
  description: 'retira a permissão de "@everyone" (ou o membro/cargo mencionado) enviar mensagens no chat',
  userPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],

  /**
   * 
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
          deny: [Discord.Permissions.FLAGS.SEND_MESSAGES],
        },
      ], 'por: ' + message.member.id);

    } else {
      message.channel.permissionOverwrites.set([
        {
          id: message.guild.roles.everyone.id,
          deny: [Discord.Permissions.FLAGS.SEND_MESSAGES],
        },
      ], 'por: ' + message.member.id);
      target = '@ everyone'
    }

    const embed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Canal Bloqueado com sucesso!')
      .setDescription(`agora "${target}" não pode(m) mais enviar mensagens nesse canal`);

    message.reply({ embeds: [embed] });

  }
}