const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'top',
  aliases: ['leaderboard', 'lb', 'ranking', 'rank'],
  description: "exibe o ranking de estrelas, xp, ou outros dados",

  async execute(client, message, args) {

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Ranking do servidor');

    let description = '';

    if (!args[0] || ['dinheiro', 'money', 'star', 'stars', 'estrela', 'estrelas'].includes(args[0].toLowerCase())) {
      let totalResults = await profileModel.find()
        .sort({
          coins: -1,
          bank: -1
        })
        .limit(10)

      let i=1;
      totalResults.forEach(resultData => {

        let user = client.users.cache.get(resultData.userID);

        embed.addField(`${i}° - ${user.tag}`, `saldo: ${resultData.bank + resultData.coins} ✨\n`);

        i++;

      })
    }
    else if (['carteira', 'wallet'].includes(args[0].toLowerCase())) {
      let totalResults = await profileModel.find()
        .sort({
          coins: -1
        })
        .limit(10)

      let i=1;
      totalResults.forEach(resultData => {

        let user = client.users.cache.get(resultData.userID);

        embed.addField(`${i}° - ${user.tag}`, `saldo em carteira: ${resultData.coins} ✨\n`);

        i++;

      })
    }
    else if (['bank', 'banco'].includes(args[0].toLowerCase())) {
      let totalResults = await profileModel.find()
        .sort({
          banco: -1
        })
        .limit(10)

      let i=1;
      totalResults.forEach(resultData => {

        let user = client.users.cache.get(resultData.userID);

        embed.addField(`${i}° - ${user.tag}`, `saldo no banco: ${resultData.bank} ✨\n`);

        i++;

      })
    }
    else if (['xp', 'pontos'].includes(args[0].toLowerCase()) || !args[0]) {

      let totalResults = await profileModel.find()
        .sort({
          chatXP: -1
        })
        .limit(10)

      let i=1;
      totalResults.forEach(resultData => {

        let user = client.users.cache.get(resultData.userID);
        
        embed.addField(`${i}° - ${user.tag}`, `XP: ${resultData.chatXP}\n`);

        i++;

      })

    } else if (['call', 'voz', 'voice'].includes(args[0].toLowerCase())) {

      let totalResults = await profileModel.find()
        .sort({
          voiceXP: -1
        })
        .limit(10)

      let i=1;
      totalResults.forEach(resultData => {

        let user = client.users.cache.get(resultData.userID);
        
        embed.addField(`${i}° - ${user.tag}`, `XP por call: ${resultData.voiceXP}\n`);

        i++;

      })

    }

    message.channel.send(embed);

  }
}