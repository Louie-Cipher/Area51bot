const Discord = require("discord.js");

module.exports = {
  name: 'adv',
  aliases: ['advertencia', 'warn', 'aviso'],
  description: 'aplica uma advertencia no membro mencionado, ou pelo ID',
  userPermissions: ['MUTE_MEMBERS'],

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    let adv1 = message.guild.roles.cache.get('821895170533359616');
    let adv2 = message.guild.roles.cache.get('821895480035377183');
    let adv3 = message.guild.roles.cache.get('821895591737950208');

    let advChannel = message.guild.channels.cache.get('868322635342282762');

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!args[0]) return message.reply({ embeds: [{ color: '#ffff00', description: 'mencione alguém para aplicar a advertencia' }] });

    let member = await message.guild.members.fetch(user.id);

    if (!member) return message.reply({ embeds: [{ color: '#ffff00', description: 'membro não encontrado' }] });

    if (args[1] == 'reset' || args[1] == 'resetar') {
      member.roles.remove({ roles: [adv1, adv2, adv3] })

      advChannel.send({
        embeds: [{
          color: '#ffff50',
          title: 'Advertências resetadas',
          fields: [
            { name: 'membro', value: `${user}` },
            { name: 'removido por', value: `${message.author}` }
          ]
        }]
      })
      return;
    }

    if (args[1] == 'remover' || args[1] == 'remove') {

      let advRole

      if (member.roles.cache.has(adv1.id)) {
        member.roles.remove(adv1);
        advRole = 'nenhuma 😇';
      }
      if (member.roles.cache.has(adv2.id)) {
        member.roles.remove(adv2);
        member.roles.add(adv1);
        advRole = adv1;
      }
      if (member.roles.cache.has(adv3.id)) {
        member.roles.remove(adv3);
        member.roles.add(adv2);
        advRole = adv2;
      }

      return advChannel.send({
        embeds: [{
          color: '#ffff50',
          title: 'Advertencia(s) removida(s)',
          fields: [
            { name: 'membro', value: `${user}` },
            { name: 'advertencia atual', value: `${advRole}` },
            { name: 'removido por', value: `${message.author}` }
          ]
        }]
      })

    }

    let advRole = adv1

    if (member.roles.cache.get(adv3))
      return message.reply({ embeds: [{ color: 'ORANGE', description: 'membro já possui 3 advertencias. não é possivel aplicar mais advertencias' }] });

    if (member.roles.cache.get(adv2)) {
      member.roles.remove({ role: adv2 });
      advRole = adv3;
    }

    if (member.roles.cache.get(adv1)) {
      member.roles.remove({ role: adv1 })
      advRole = adv2;
    }


    let reason = args.join(' ').substring(args[0].length - 1);

    if (!args[1]) {
      reason = 'não informado';
    }

    member.roles.add({ role: advRole }, `Advertencia por: ${message.author.id}\nMotivo: ${reason}`);

    let embed = new Discord.MessageEmbed()
      .setColor('#ffff50')
      .setTitle('Advertencia aplicada')
      .addFields(
        { name: 'membro', value: `${user}` },
        { name: 'número da advertencia', value: `${advRole}` },
        { name: 'motivo', value: `${reason}` },
        { name: 'advertido por', value: `${message.author}` }
      );

    if (message.channel.id != advChannel.id) message.reply({ embeds: [{ title: 'advertência aplicada' }] });
    advChannel.send({ embeds: [embed] });

  }
}