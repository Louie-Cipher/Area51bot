const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'addmoney',
  aliases: ['setmoney'],
  description: "adciona ou remove estrelas ao usuário",
  userPermissions: ['ADMINISTRATOR'],

  async execute(client, message, args) {

    if (!args[1]) return message.reply({
      content: 'Você precisa informar alguém para alterar o saldo, e em seguida o valor\nExemplo: a.setmoney @area51bot 200'
    })

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user || user == undefined) return message.reply({
      embeds: [{
        color: '#f0f000',
        title: 'Usuário informado invalido',
        description: `Não foi possível achar o usuário informado`
      }]
    });

    let valor = parseInt(args[1]);

    if (!valor || valor == NaN) return message.reply({
      embeds: [{
        color: '#f0f000',
        title: 'Valor informado invalido',
        description: `**${valor}** não é um valor válido`
      }]
    });

    let profileData = await profileModel.findOne({ userID: user.id });

    if (!profileData || profileData == undefined) return message.reply({
      embeds: [{
        color: '#f0f000',
        title: 'Usuário informado não possui um perfil no bot',
        description: `Não foi possível achar o usuário informado no banco de dados`
      }]
    });

    let profileUpdate = await profileModel.findOneAndUpdate(
      {
        userID: user.id,
      }, {
      $inc: {
        bank: valor
      },
      lastEditMoney: Date.now()
    }
    );
    profileUpdate.save();

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Valor alterado com sucesso')
      .addFields(
        { name: 'Usuário', value: user.toString() },
        { name: 'valor', value: valor.toString() },
        { name: 'valor atual na carteira', value: (profileData.coins) },
        { name: 'saldo atual no banco', value: (profileData.bank + valor) }
      );

    message.reply({ embeds: [embed] });

  }
}
