const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'saque',
  aliases: ['sacar', 'withdraw', 'with'],
  description: "saca o valor informado, transferindo do banco para a sua carteira",

  async execute(client, message, args) {

    if (!args[0]) return message.reply({
      embeds: [{
        color: '#f0f000',
        title: 'Informe um valor para sacar',
        description: ` O valor precisa ser um número inteiro (sem virgula) e positivo`
      }]
    });

    let profileData = await profileModel.findOne({ userID: message.author.id });

    let allNames = ['all', 'tudo', 'total'];

    let valor = 0;

    //all
    if (allNames.includes(args[0])) {
      valor = profileData.bank;
    }/*
    //porcentagem
    else if(args[0].includes('%') || args[1].includes('%')) {
      valor = Math.floor( profileData.bank * (parseInt(args[0] / 100)) )
    }
    //milhar
    else if (args[0].toLowerCase().includes('k') || args[1].toLowerCase().includes('k') ) {
      valor = parseInt(args[0], 10) * 1000
    }
    //milhão
    else if (args[0].toLowerCase().includes('m') || args[1].toLowerCase().includes('m') ) {
      valor = parseInt(args[0], 10) * 1000 * 1000
    }
    //bilhão
    else if (args[0].toLowerCase().includes('b') || args[1].toLowerCase().includes('b') ) {
      valor = parseInt(args[0], 10) * 1000 * 1000 * 1000
    }
    //operações matemáticas
    else if (args[1].toLowerCase().includes('*') ) { //multiplicação
      valor = parseInt(args[0], 10) * parseInt(args[2], 10)
    }
    else if (args[1].toLowerCase().includes('/') ) { //divisão
      valor = parseInt(args[0], 10) / parseInt(args[2], 10)
    }
    else if (args[1].toLowerCase().includes('+') ) { //adição
      valor = parseInt(args[0], 10) + parseInt(args[2], 10)
    }
    else if (args[1].toLowerCase().includes('-') ) { //subtração
      valor = parseInt(args[0], 10) - parseInt(args[2], 10)
    }*/
    else {
      valor = parseInt(args[0], 10);
    }

    if (!valor || valor < 1 || valor == NaN) return message.reply({
      embeds: [{
        color: '#f0f000',
        title: 'Valor informado invalido',
        description: `**${valor}** não é um valor válido. O valor precisa ser um número inteiro (sem virgula) e positivo`
      }]
    });

    let failEmbed = new Discord.MessageEmbed()
      .setColor('#b3c20c')
      .setTitle('Você não possui esse valor na carteira para sacar')
      .setDescription(`Você atualmente tem ${profileData.coins} stars na carteira, e ${profileData.bank} no banco`);

    if (profileData.bank < valor) return message.reply({ embeds: [failEmbed] });

    let profileUpdate = await profileModel.findOneAndUpdate(
      {
        userID: message.author.id,
      }, {
      $inc: {
        bank: -valor,
        coins: valor
      },
      lastEditMoney: Date.now()
    }
    );
    profileUpdate.save();

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Saque efetuado com sucesso')
      .addFields(
        { name: 'valor', value: valor.toString(), },
        { name: 'valor atual na carteira', value: (profileData.coins + valor).toString() },
        { name: 'saldo atual no banco', value: (profileData.bank - valor).toString() }
      );

    message.reply({ embeds: [embed] });

  }
}