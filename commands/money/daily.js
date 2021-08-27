const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'daily',
  aliases: ['diario', 'diário'],
  description: "resgata a sua recompensa diária, ganhando entre 150 a 300 Stars",

  async execute(client, message, args) {

    let boost = 0

    if(message.member.roles.cache.has('828983379135299634')) boost = 200

    var randomCoins = Math.floor(Math.random() * 150) + 150 + boost;

    let profileCheck = await profileModel.findOne({userID: message.author.id});
    let dateNow = new Date()

    let lastDaily = new Date(profileCheck.lastDaily);

    if (lastDaily.getDate() == dateNow.getDate() || lastDaily.getTime() < 86400000 )
      return message.channel.send({content: message.author, embed: {
        color: '#b3c20c',
        title: '⏳ Ei, você já resgatou sua reconpensa hoje!',
        description: '⏳⭐ Volte amanhã para resgatar mais estrelas',
        footer: { text: `OBS: se você começou a usar o bot hoje,\ndeve esperar até amanhã para resgatar sua primeira recompensa
        
dica: Você sabia que sendo booster do servidor,
você ganha até 100 moedas a mais no daily?` }
      }});

    let profileData = await profileModel.findOneAndUpdate(
      {
        userID: message.author.id,
      }, {
          $inc: {coins: randomCoins},
          lastDaily: Date.now()
        }
    )
    profileData.save();

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('💰 Recompensa diária 💰')
      .setDescription(`✨ Parabéns! você ganhou **${randomCoins} Stars** hoje! ✨
      agora voce possui ${profileData.bank + profileData.coins + randomCoins} Stars no total`)
      .setFooter('volte amanhã para resgatar mais\n\ndica: Você sabia que sendo booster do servidor,\nvocê ganha 200 moedas a mais no daily?');

    message.channel.send(`${message.author}`, embed);


  }
}