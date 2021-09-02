const Discord = require("discord.js");

module.exports = {
  name: 'ban',
  aliases: ['hackban', 'banir'],
  description: "bane o usuário mencionado do servidor",
  userPermissions: 'BAN_MEMBERS',

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!args[0]) return message.reply({ content: 'Mencione ou informe o ID de algum usuário para banir.' });
    if (!user) return message.reply({ content: 'Usuário informado não encontrado.' });
    if (user.id === message.author.id) return message.reply({content: 'Ei, você não pode se auto banir!'});
    if(user.id === client.user.id) return message.reply({content: 'Ei, você não pode me banir usando meu próprio comando!'});

    let member = await message.guild.members.fetch(user);

    if (!member) return message.reply({ content: 'Membro não encontrado ou não está no servidor.' });

    if (!member.bannable) return message.reply({ content: 'Eu não posso banir esse usuário. verifique minhas permissões e minha hierarquia nas configurações de cargos do servidor' });


    let banReason = 'Não informado';
    let daysDelete = 0

    if (args[1]) {

      let fullArgs = args.join(' ')
      banReason = fullArgs.substring(args[0].length - 1)

      if (fullArgs.includes('|')) {
        daysDelete = parseInt(fullArgs.split('|')[1], 10);
        banReason = fullArgs.substring(args[0].length - 1, fullArgs.length)
      }
      if (daysDelete > 7) daysDelete = 7
      else if (daysDelete < 0) daysDelete = 0
    }

    let confirmEmbed = new Discord.MessageEmbed()
      .setColor('ORANGE')
      .setTitle('Confirmar banimento?')
      .setDescription('Para confirmar, clique no botão abaixo')
      .addFields(
        { name: 'Membro', value: member.toString() },
        { name: 'motivo:', value: banReason }
      );
    if (daysDelete != 0) confirmEmbed.addField('Apagar mensagens dos últimos', daysDelete + ' dias');

    let buttons = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('confirmar')
          .setLabel('confirmar')
          .setStyle('SUCCESS'),
        new Discord.MessageButton()
          .setCustomId('cancelar')
          .setLabel('cancelar')
          .setStyle('DANGER')
      );

    let confirmMsg = await message.reply({ embeds: [confirmEmbed], components: [buttons] });

    client.on('interactionCreate', async interaction => {

      if (!interaction.isButton()) return;
      if (interaction.message.id != confirmMsg.id) return;
      if (interaction.member.id != message.author.id) return;

      if (interaction.component.customId == 'cancelar') {
        return confirmMsg.edit({ embeds: [{ title: '❎ Banimento cancelado. essa foi quase' }] });
      }

      confirmMsg.edit({ embeds: [{ title: `✅ ${user.tag} banido!` }] });

      member.ban({ days: daysDelete, reason: 'Banido por: ' + message.author.id + '\nMotivo: ' + banReason });

      let logEmbed = new Discord.MessageEmbed()
        .setColor('#ff1000')
        .setTitle('Membro banido')
        .addFields(
          { name: 'usuário banido', value: `${user.tag}` },
          { name: 'ID', value: `${user.id}` },
          { name: 'motivo', value: banReason },
          { name: 'banido por', value: `${message.author}` }
        )

      let logChannel = await client.channels.fetch('819224181437890640')

      logChannel.send({ embeds: [logEmbed] });

    });


  }
}