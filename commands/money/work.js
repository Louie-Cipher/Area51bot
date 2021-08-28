const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'work',
  aliases: ['trabalho'],
  description: "trabalha, e ganha de 80 a 120 estrelas",

  async execute(client, message, args) {

    let boost = 0

    if(message.member.roles.cache.has('828983379135299634')) boost = 30

    var randomCoins = Math.floor(Math.random() * 40) + 80 + boost;

    let profileData = await profileModel.findOne({userID: message.author.id});

    let dateNow = new Date();

    if(profileData.lastWork) {

      let lastWork = new Date(profileData.lastWork);
      let nextWork = new Date( 7200000 + lastWork.getTime() );
      let diferenca = new Date(nextWork.getTime() - dateNow.getTime())

      if ( dateNow.getTime() - lastWork.getTime() < 7200000 )
        return message.channel.send({content: message.author, embed: {
          color: '#b3c20c',
          title: '⏳ Você já trabalhou nas últimas 2 horas',
          description: `⏳⭐ Volte novamente em: ${diferenca.getHours()} h e ${diferenca.getMinutes()} min`,
          footer: { text: `dica: Você sabia que sendo booster do servidor,\nvocê ganha 30 estrelas a mais no work?` }
        }});


    }

    profileData = await profileModel.findOneAndUpdate(
      {
        userID: message.author.id,
      }, {
          $inc: {coins: randomCoins},
          lastWork: Date.now()
        }
    )
    profileData.save();

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('👷‍♀️ Trabalho 👷‍♂️')
      .setDescription(`✨ Você trabalhou e você ganhou **${randomCoins} Stars**! ✨
      agora voce possui ${profileData.bank + profileData.coins + randomCoins} Stars no total\nVolte daqui a 2h e trabalhe mais para receber mais estrelas`)
      .setFooter('dica: Você sabia que sendo booster do servidor,\n\você ganha 30 estrelas a mais no daily?');

    message.channel.send(`${message.author}`, embed);


  }
}