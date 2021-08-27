const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'deposit',
  aliases: ['dep', 'depositar', 'depósito', 'deposito'],
  description: "deposita o valor informado, transferindo da sua carteira para o banco",

  async execute(client, message, args) {

    let profileData = await profileModel.findOne({userID: message.author.id});

    let allNames = ['all', 'tudo', 'total'];

    let valor = 0;

    //all
    if (allNames.includes(args[0]) ) {
      valor = profileData.coins;
    }/*
    //porcentagem
    else if(args[0].includes('%') || args[1].includes('%')) {
      valor = Math.floor( profileData.coins * (parseInt(args[0] / 100)) )
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

    if(!valor || valor < 1 || valor == NaN) return message.channel.send({content: message.author, embed: {
      color: '#f0f000',
      title: 'Valor informado invalido',
      description: `**${valor}** não é um valor válido. O valor precisa ser um número inteiro (sem virgula) e positivo`
      /*fields: [
        {name: '%', value: 'porcentagem em relação ao valor que você possui em carteira'},
        {name: 'all', value: 'todo o valor que você possui em carteira'},
        {name: 'k', value: 'milhar. multiplica o valor informado por mil'},
        {name: 'm', value: 'milhão. multiplica o valor informado por 1 milhão'},
        {name: 'b', value: 'bilhão. multiplica o valor informado por 1 bilhão'},
        {name: '+ ou - ou * ou /', value: `realiza a operação matemática informada com o primeiro numero e o segundo número
        (separe os valores e o sinal da operação com espaço)
        exemplo: 500 * 10`},
      ]*/
    }});

    let failEmbed = new Discord.MessageEmbed()
      .setColor('#b3c20c')
      .setTitle('Você não possui esse valor na carteira para depositar')
      .setDescription(`Você atualmente tem ${profileData.coins} stars na carteira, e ${profileData.bank} no banco`);

    if( profileData.coins < valor ) return message.channel.send(message.author, failEmbed);

    let profileUpdate = await profileModel.findOneAndUpdate(
      {
        userID: message.author.id,
      }, {
          $inc:{
            bank: valor,
            coins: -valor
          },
          lastEditMoney: Date.now()
        }
    );
    profileUpdate.save();

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Valor depositado com sucesso')
      .addFields(
        {name: 'valor', value: valor,},
        {name: 'valor atual na carteira', value: (profileData.coins - valor)},
        {name: 'saldo atual no banco', value: (profileData.bank + valor)}
      );

    message.channel.send(`${message.author}`, embed);

  }
}