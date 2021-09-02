const Discord = require("discord.js");

module.exports = {
  name: 'mute',
  aliases: ['mutar', 'silenciar', 'silent'],
  description: 'silencia um membro de enviar mensagens nos canais de texto, e de falar nos canais de voz',
  userPermissions: ['MUTE_MEMBERS'],

  /**
   * 
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   * @returns 
   */

  async execute(client, message, args) {

    let muteRole = message.guild.roles.cache.get('824108719377612831');

    let muteChannel = message.guild.channels.cache.get('819226284311314482');

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!args[0]) return message.channel.send({ embeds: [{ color: '#ffff00', description: 'mencione alguém para mutar' }] });
    if (user.id === message.author.id) return message.reply({content: 'Ei, você não pode se auto mutar!'});
    if(user.id === client.user.id) return message.reply({content: 'Ei, você não pode me mutar usando meu próprio comando!'});

    let member = await message.guild.members.fetch(user.id)

    if (!member) return message.channel.send({ embeds: [{ color: '#ffff00', description: 'usuário informado não encontrado no servidor' }] });

    let reason = args.join(' ').substring(args[0].length);

    if (!args[1]) {
      reason = 'não informado';
    }

    member.roles.add({role: muteRole, reason: `Mutado por: ${message.author.id}\nMotivo: ${reason}`});
    let embed = new Discord.MessageEmbed()
      .setColor('#ffff50')
      .setTitle('Membro mutado')
      .addFields(
        { name: 'membro', value: `${user}` },
        { name: 'motivo', value: reason },
        { name: 'mutado por', value: `${message.author}` }
      );

    muteChannel.send({embeds: {embed}});
    message.channel.send()

  }
}