const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'money',
  aliases: ['saldo', 'dinheiro', 'valor', 'balance', 'bal'],
  description: "mostra informações sobre a quantia em Stars de um usuário",

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (args[0] && !user)
      return message.reply({ embeds: [{ color: '#b3c20c', title: 'usuário informado não encontrado' }] })

    if (!user) user = message.author;

    if (user.bot)
      return message.reply({
        embeds: [{
          title: `${user.tag}`, description: 'Bip Bop | Bots não possuem perfil no Area51Bot'
        }]
      });

    let profileData = await profileModel.findOne({ userID: user.id });

    if (!profileData) return message.channel.send({ embeds: [{ color: '#009999', title: 'Esse usuário ainda não possui um perfil no Area51Bot', description: 'um perfil será criado automaticamente após o usuário enviar uma mensagem pela primeira vez' }] });

    let lastEdit = new Date(profileData.lastEditMoney.getTime() - 10800000);

    let dateFormat = `${lastEdit.getDate()}/${lastEdit.getMonth() + 1}/${lastEdit.getFullYear()} - ${lastEdit.getHours()}:${lastEdit.getMinutes()}`

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle(`Saldo em Stars de ${user.username}`);

    if (profileData.userID == message.author.id || message.member.permissions.has('MANAGE_MESSAGES')) {

      embed.addFields(
        { name: 'carteira', value: profileData.coins },
        { name: 'banco', value: profileData.bank },
        { name: 'última alteração de saldo', value: dateFormat }
      )
    } else {
      embed.addFields(
        { name: 'saldo total', value: profileData.coins + profileData.bank }
      )
    }


    message.reply({ embeds: [embed] });

  }
}