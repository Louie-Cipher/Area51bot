const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'transfer',
  aliases: ['transferir', 'transferencia', 'pay', 'pagar', 'pix'],
  description: "transfere o valor da sua carteira para a carteira do usuário mencionado",

  async execute(client, message, args) {

    let valor = parseInt(args[1], 10);

    let user2 = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!args[0] || !args[1]) return message.reply({
      embeds: [{
        color: '#f0f000',
        title: 'Transferência de Estrelas',
        description: `mencione alguém ou informe um ID, e o valor que deseja transferir da sua carteira para a carteira da pessoa
      Exemplo: \`transfer @Louie 250\``
      }]
    });

    if (!user2) return message.reply({
      embed: [{
        color: '#b3c20c', title: 'usuário informado não encontrado'
      }]
    });

    if (user2.bot) return message.reply({
      embeds: [{
        title: `${user2.username}`,
        description: '🤖 Bip Bop | Bots não possuem perfil ou saldo em Estrelas'
      }]
    });

    let profileData1 = await profileModel.findOne({ userID: message.author.id });
    let profileData2 = await profileModel.findOne({ userID: user2.id });

    if (!profileData2) return message.reply({
      embeds: [{
        color: '#b3c20c',
        title: 'usuário informado ainda não possui Stars ou um perfil no Area51Bot'
      }]
    });

    if (!valor || valor < 1) return message.reply({
      embeds: [{
        color: '#f0f000', title: 'informe um valor para transferir',
        description: 'o valor precisa ser um número inteiro (sem virgula) e positivo (maior que zero)'
      }]
    });

    if (profileData1.coins < valor) return message.reply({
      embeds: {
        color: '#b3c20c',
        title: 'Você não possui esse valor na carteira para transferir',
        description: `Você atualmente tem ${profileData1.coins} na carteira, e ${profileData1.bank} no banco`
      }
    });

    let profileUpdate1 = await profileModel.findOneAndUpdate(
      {
        userID: message.author.id,
      }, {
      $inc: {
        coins: -valor
      },
      lastEditMoney: Date.now()
    }
    );
    profileUpdate1.save();

    let profileUpdate2 = await profileModel.findOneAndUpdate(
      {
        userID: user2.id,
      }, {
      $inc: {
        coins: valor
      },
      lastEditMoney: Date.now()
    }
    );
    profileUpdate2.save();

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('📤Transferência efetuada com sucesso📥')
      .addFields(
        { name: 'valor', value: valor.toString() },
        { name: 'seu saldo atual', value: (profileData1.coins - valor).toString() },
        { name: `saldo atual de ${user2.username}`, value: (profileData2.bank + valor).toString() }
      );

    message.reply({ embeds: [embed] });

  }
}