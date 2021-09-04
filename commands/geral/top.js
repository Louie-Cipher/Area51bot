const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'top',
  aliases: ['leaderboard', 'lb', 'ranking', 'rank'],
  description: "exibe o ranking de estrelas, xp, ou outros dados",

  /**
   * 
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Ranking do servidor');

    let description = '';
    
    if (args[0] && ['dinheiro', 'money', 'star', 'stars', 'estrela', 'estrelas'].includes(args[0].toLowerCase())) {

      embed.setDescription('Rank de estrelas');

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
    else if (args[0] && ['carteira', 'wallet'].includes(args[0].toLowerCase()) && message.member.permissions.has('MANAGE_MESSAGES')) {

      embed.setDescription('Rank de saldo em carteira');

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
    else if (args[0] && ['bank', 'banco'].includes(args[0].toLowerCase())) {

      embed.setDescription('Rank de saldo em banco');

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
    else if (args[0] && ['call', 'voz', 'voice'].includes(args[0].toLowerCase())) {

      embed.setDescription('Rank de XP por call');

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
    else {

      embed.setDescription('Rank de XP por chat');

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

    }

    message.reply({embeds: [embed]});

  }
}