const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'blackjack',
  aliases: ['bj', '21'],
  description: "joga uma partida de BlackJack (21), apostando suas estrelas",

  async execute(client, message, args) {

    return message.channel.send('Comando em construção...');

    if (!args[0]) return message.channel.send({embed: {
      color: '#b3c20c',
      description: 'Você precisa informar um valor para apostar'
    }});

    const value = parseInt(args[0], 10);

    if (valor < 1 || valor == NaN) return message.channel.send({embed: {
      color: '#b3c20c',
      title: `O valor da aposta precisa ser um número inteiro (sem vírgula) e positivo`
    }});

    let profileData = await profileModel.findOne({userID: message.author.id});

    if(profileData.coins < valor) return message.channel.send({embed: {
      color: '#b3c20c',
      title: `Você não possui esse valor na carteira.`,
      description: `Você atualmente possui **${profileData1.coins} estrelas**`
    }});

    const totalCards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'K', 'Q', 'J'];

    let rand = Math.floor(Math.random() * cards.length);

    let card = totalCards[rand];

    let embed = new Discord.MessageEmbed()
      .setColor('#4d00b3')
      .setTitle('BlackJack')
      .setDescription('')

  }
}