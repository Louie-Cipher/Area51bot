const Discord = require('discord.js');
const profileModel = require('../mongoSchema/profile');

module.exports = {

  async trigger(client, reaction, user) {
    if(reaction.users.cache.size > 2) return;
    if(reaction.message.author.id != client.user.id) return;
    if (user.bot) return;
    if(!reaction.message.embeds[0]) return;

    let chalengeMessage = await reaction.message;
    let chalengeEmbed = await reaction.message.embeds[0];

    let player1;
    let player2;

    if (chalengeEmbed.fields[0].value.length == 22) {
      player1 = client.users.cache.get(chalengeEmbed.fields[0].value.substring(3,21))
    } else {
      player1 = client.users.cache.get(chalengeEmbed.fields[0].value.substring(2,20))
    }

    if (chalengeEmbed.fields[1].value.length == 22) {
      player2 = client.users.cache.get(chalengeEmbed.fields[1].value.substring(3,21))
    } else {
      player2 = client.users.cache.get(chalengeEmbed.fields[1].value.substring(2,20))
    }

    let valor = parseInt(chalengeEmbed.fields[2].value);

    let profileData1 = await profileModel.findOne({userID: player1.id});
    let profileData2 = await profileModel.findOne({userID: player2.id});

    if(profileData1.coins < valor) return message.channel.send({embed: {
      color: '#b3c20c',
      title: `Você não possui esse valor na carteira.`,
      description: `Você atualmente possui **${profileData1.coins} estrelas**`
    }});
    if(profileData2.coins < valor) return message.channel.send({embed: {
      color: '#b3c20c',
      title: `${player2.tag} não possui esse valor na carteira.`,
      description: `${player2.tag} atualmente possui **${profileData1.coins} estrelas**`
    }});

    let rand = Math.floor(Math.random() * 2);

    let resultEmbed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Cara ou Coroa')

      

    if (rand == 0) {
      resultEmbed.setDescription(`Parabéns ${player2}, você venceu, e ganhou ${valor} Stars
      Sinto muito ${player1}, você perdeu`);

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
      profileUpdate1.save();

      let profileUpdate2 = await profileModel.findOneAndUpdate(
        {
          userID: player2.id,
        }, {
          $inc:{
            coins: valor
          },
          lastEditMoney: Date.now()
        }
      );
      profileUpdate2.save();
      } else {
        resultEmbed.setDescription(`Parabéns ${player1}, você venceu, e ganhou ${valor} Stars
      Sinto muito ${player2}, você perdeu`);

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

      let profileUpdate2 = await profileModel.findOneAndUpdate(
        {
          userID: player2.id,
        }, {
          $inc:{
            coins: -valor
          },
          lastEditMoney: Date.now()
        }
      );
      profileUpdate2.save();
      }
    

    reaction.message.edit('Resultado da aposta', resultEmbed);

    reaction.remove()

  }
}