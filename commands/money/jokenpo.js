const Discord = require("discord.js")
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'pedrapapeltesoura',
  aliases: ['pedra', 'papel', 'tesoura'],
  description: "apostar suas estrelas no pedra papel tesoura",

  async execute(client, message, args) {

    if (!args[0]) return message.reply({
      embeds: [{
        color: '#ff5900',
        description: 'Informe um valor para apostar'
      }]
    });

    let value = parseInt(args[0], 10);

    if (!value || value === NaN || value < 1) return message.reply({
      embeds: [{
        color: '#ff5900',
        title: 'Valor informado inválido',
        description: 'O valor precisa ser um número inteiro (sem virgula), e positivo'
      }]
    });

    let profileData = await profileModel.findOne({ userID: message.author.id });

    if (!profileData) return message.reply({ content: 'Houve um erro de comunicação com o banco de dados. por favor, tente novamente mais tarde' });

    if (value > profileData.coins || profileData.coins - value < 0) return message.reply({
      embeds: [{
        color: '#ff5900',
        title: 'Você não possui esse valor para apostar',
        description: `Você atualmente possui **${profileData.coins} estrelas**`
      }]
    });

    let user;
    let bot;

    let values = ['pedra', 'papel', 'tesoura'];
    let emojis = ['🪨', '📃', '✂'];

    let msg = message.content.toLowerCase();

    if (msg.includes('pedra') || msg.includes('rock')) user = 0;
    else if (msg.includes('papel') || msg.includes('paper')) user = 1;
    else if (msg.includes('tesoura') || msg.includes('scissors')) user = 2;
    else user = Math.floor(Math.random() * 3);

    bot = Math.floor(Math.random() * 3);

    let dateNow = new Date()

    let embed = new Discord.MessageEmbed()
      .setTitle('Pedra 🪨 papel 📃 tesoura ✂');

    let description =
      `Você jogou: *${values[user]}* ${emojis[user]}\n Eu joguei: *${values[bot]}* ${emojis[bot]}\n\n`;

    let result = '';

    if (user == bot) {
      embed.setColor('YELLOW');
      result = '🤝 Empate. foi um bom jogo';
    }
    else if (
      (values[user] == 'pedra' && values[bot] == 'papel') ||
      (values[user] == 'papel' && values[bot] == 'tesoura') ||
      (values[user] == 'tesoura' && values[bot] == 'pedra')
    ) {
      embed.setColor('RED');
      result = `😭 Sinto muito, você perdeu! prejuízo de ${value} estrelas`;

      let profileUpdate = await profileModel.findOneAndUpdate({ userID: message.author.id },
        {
          $inc: {
            coins: -value
          },
          lastEditMoney: dateNow
        });
      profileUpdate.save();
    }
    else {
      embed.setColor('GREEN')
      result = `🎉 Parabéns, você venceu! E ganhou ${value} estrelas`

      let profileUpdate = await profileModel.findOneAndUpdate({ userID: message.author.id },
        {
          $inc: {
            coins: value
          },
          lastEditMoney: dateNow
        });
      profileUpdate.save();
    }

    if (values[user] == 'tesoura' && values[bot] == 'tesoura') {
      result = '✂ Empate ✂\nFoi uma bela partida'
    }

    embed.setDescription(description + result)

    message.reply({ embeds: [embed] });

  }
}