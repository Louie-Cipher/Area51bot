const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'addmoney',
  aliases: ['setmoney'],
  description: "adciona ou remove estrelas ao usuário",
  userPermissions: ['ADMINISTRATOR'],

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    let valor = parseInt(args[1]);

    let profileData = await profileModel.findOne({userID: user.id});

    if(!valor || valor == NaN) return message.channel.send({embed: {
      color: '#f0f000',
      title: 'Valor informado invalido',
      description: `**${valor}** não é um valor válido`
    }});

    let profileUpdate = await profileModel.findOneAndUpdate(
      {
        userID: user.id,
      }, {
          $inc:{
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
        {name: 'Usuário', value: user},
        {name: 'valor', value: valor},
        {name: 'valor atual na carteira', value: (profileData.coins)},
        {name: 'saldo atual no banco', value: (profileData.bank + valor)}
      );

    message.channel.send(embed);

  }
}