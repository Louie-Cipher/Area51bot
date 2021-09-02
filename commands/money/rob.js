const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'rob',
  aliases: ['roubo', 'roubar'],
  description: "tenta roubar o valor da carteira de outra pessoa",

  async execute(client, message, args) {

    //return message.channel.send('Comando em manutenção...')

    let user2 = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!args[0]) return message.reply({
      embeds: [{
        color: '#f0f000',
        title: 'Roubo',
        description: `mencione alguém ou informe um ID da pessoa que deseja roubar`
      }]
    });

    if (!user2) return message.reply({
      embeds: [{
        color: '#b3c20c', title: 'usuário informado não encontrado'
      }]
    });

    if (user2.bot) return message.reply({
      embeds: [{
        title: `${user2.username}`,
        description: '🤖 Bip Bop | Bots não possuem saldo em Estrelas'
      }]
    });

    if (user2.id == process.env['louie']) {
      let webhook = await message.channel.createWebhook('Louie');
      webhook.send({ content: 'eu irei me vingar...' });
      webhook.delete()
    }

    let profileData1 = await profileModel.findOne({ userID: message.author.id });
    let profileData2 = await profileModel.findOne({ userID: user2.id });

    if (!profileData2) return message.reply({
      embeds: [{
        color: '#b3c20c',
        title: 'usuário informado ainda não possui Estrelas'
      }]
    });

    if (profileData1.lastRob) {
      let lastRob = new Date(profileData1.lastRob);
      let dateNow = new Date();
      let nextRob = new Date(3600000 + lastRob.getTime())
      let diferenca = new Date(nextRob.getTime() - dateNow.getTime())

      if ((dateNow.getTime() - lastRob.getTime()) < 3600000) return message.reply({
        embeds: [{
          color: '#ff0000',
          title: '⏳ Você já roubou alguém a menos de 1h',
          description: `Só poderá usar o roubo novamente em: ${diferenca.getHours()}h e ${diferenca.getMinutes()} min**`
        }]
      });
    }

    let multa = Math.floor(((profileData1.coins + profileData1.bank) * 25) / 100);
    if (multa < 1) { multa = 250 }

    let robChance = Math.round(Math.random() * 3);

    if (robChance == 1) {
      let robPercent = Math.floor((profileData2.coins * 70) / 100);

      let profileUpdate1 = await profileModel.findOneAndUpdate(
        {
          userID: message.author.id,
        }, {
        $inc: {
          coins: robPercent
        },
        lastRob: Date.now(),
        lastEditMoney: Date.now()
      }
      );
      profileUpdate1.save();

      let profileUpdate2 = await profileModel.findOneAndUpdate(
        {
          userID: user2.id,
        }, {
        $inc: {
          coins: -robPercent
        },
        lastEditMoney: Date.now()
      }
      );
      profileUpdate2.save();



      message.reply({
        embeds: [{
          color: '#00ff00',
          description: `🔫 Você roubou ${robPercent} estrelas de ${user2}`
        }]
      });

    } else {

      let profileUpdate1 = await profileModel.findOneAndUpdate(
        {
          userID: message.author.id,
        }, {
        $inc: {
          coins: -multa
        },
        lastRob: Date.now(),
        lastEditMoney: Date.now()
      }
      );
      profileUpdate1.save();


      message.reply({
        embeds: [{
          color: '#ff0000',
          description: `<a:red_sirene:833800476817752084> Você tentou roubar Estrelas de ${user2} mas acabou sendo pego pelos adms <a:red_sirene:833800476817752084>
        Recebeu uma multa de ${multa} Estrelas 📉`
        }]
      })
    }

  }
}