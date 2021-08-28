const Discord = require("discord.js")
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'coin',
  aliases: ['moeda', 'coinflip', 'caracoroa', 'caraoucoroa', 'bet'],
  description: "apostar suas moedas no cara ou coroa",

  async execute(client, message, args) {

    if (!args[0] || !args[1]) return message.channel.send({content: message.author, embed: {
      color: '#b3c20c',
      title: 'Você precisa mencionar alguém para desafiar, e colocar o valor da aposta',
      description: 'Exemplo: a.moeda @Louie 200\nPara apostar solo, basta me mencionar. Exemplo: a.coin @area51bot 100'
    }});

    let player1 = message.author;
    let player2 = message.mentions.users.first() || client.users.cache.get(args[0]);

    let valor = parseInt(args[1]);

    if (!player2) return message.channel.send({embed: {
      color: '#b3c20c', title: 'usuário informado não encontrado'
    }});

    let profileData1 = await profileModel.findOne({userID: player1.id});
    let profileData2 = await profileModel.findOne({userID: player2.id});

    if (!profileData2 && player2.id != client.user.id) return message.channel.send({content: message.author, embed: {
      color: '#b3c20c',
      title: 'usuário informado ainda não possui um perfil ou estrelas no bot'
    }});

    if (valor < 1 || valor == NaN) return message.channel.send({content: message.author, embed: {
      color: '#b3c20c',
      title: `O valor da aposta precisa ser um número inteiro (sem vírgula) e positivo`
    }});

    if(profileData1.coins < valor) return message.channel.send({content: message.author, embed: {
      color: '#b3c20c',
      title: `Você não possui esse valor na carteira.`,
      description: `Você atualmente possui **${profileData1.coins} estrelas**`
    }});
    if(player2.id != client.user.id && profileData2.coins < valor) return message.channel.send({content: message.author, embed: {
      color: '#b3c20c',
      title: `${player2.tag} não possui esse valor na carteira.`,
      description: `${player2.tag} atualmente possui **${profileData1.coins} estrelas**`
    }});

    if (player2.id != client.user.id) {
    let coinMessage = await message.channel.send(`${player2}. ${player1} deseja apostar ${valor} estrelas com você. aceitar?`,
    {embed: {
      color: '#00ffff',
      title: 'Cara ou Coroa',
      description: 'Para aceitar, clique no emoji ✨ abaixo',
      fields: [
        {name: 'Jogador N°1', value: player1},
        {name: 'Jogador N°2', value: player2},
        {name: 'Valor', value: valor}
      ]
    }})
      
    coinMessage.react('✨')
    }
    else {

      let rand = Math.floor(Math.random() * 2);

      let resultEmbed = new Discord.MessageEmbed()
        .setTitle('Cara ou Coroa');

      if (rand == 0) {

      resultEmbed
        .setDescription(`Parabéns ${player1}, você venceu, e ganhou ${valor} Stars🎉\n
      Infelizmente, eu perdi 😭`)
        .setColor('#00ff00');

      let profileUpdate1 = await profileModel.findOneAndUpdate(
        {
          userID: player1.id,
        }, {
          $inc:{
            coins: valor
          },
          lastEditMoney: Date.now()
        }
      );
      profileUpdate1.save();

    } else {

      resultEmbed
        .setDescription(`Sinto muito ${player1}, você perdeu. prejuízo de ${valor} Stars😭\n
      Eba, eu venci! 🎉`)
        .setColor('#ff0000')
      let profileUpdate1 = await profileModel.findOneAndUpdate(
        {
          userID: player1.id,
        }, {
          $inc:{
            coins: -valor
          },
          lastEditMoney: Date.now()
        }
      );

    }

    message.channel.send(`${message.author}`, resultEmbed);
    }
   
  }
}