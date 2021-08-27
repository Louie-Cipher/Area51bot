const Discord = require('discord.js');

module.exports = {
  name: 'velha',
  aliases: ['tictactoe', 'jogodavelha', 'jogovelha'],
  description: "uma partida de jogo da velha",

  async execute(client, message, args) {

    const emptyEmoji = '⬜';
    const p1Emoji = '❎';
    const p2Emoji = '⭕';

    var emoji1 = emptyEmoji;
    var emoji2 = emptyEmoji;
    var emoji3 = emptyEmoji;
    var emoji4 = emptyEmoji;
    var emoji5 = emptyEmoji;
    var emoji6 = emptyEmoji;
    var emoji7 = emptyEmoji;
    var emoji8 = emptyEmoji;
    var emoji9 = emptyEmoji;

    var player1 = message.author;

    var player2 = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.get(args[0]);

    if (!player2) return message.reply('você precisa mencionar alguém para jogar');
    if (player1 == player2) return message.reply('você não pode jogar consigo mesmo!');
    if (player2.id == client.user.id) return message.reply('Eu não sei jogar jogo da velha (ainda). desculpe.');
    if (player2.bot) return message.reply('acho que meus colegas bots não sabem jogar jogo da velha...');

    var round = 1;
    var roundPlayer = player1

    var player = p1Emoji;

    var startEmbed = new Discord.MessageEmbed()
      .setColor('#f0f0f0')
      .setTitle('❎Jogo da Velha⭕')
      .addFields({ name: 'Vez de:', value: `${roundPlayer}` }, {name: 'jogada n°:', value: round});

    let messageEmbed = await message.channel.send(startEmbed)

    let line1 = await message.channel.send(emoji1 + emoji2 + emoji3);
    line1.react('1️⃣'); line1.react('2️⃣'); line1.react('3️⃣');

    let line2 = await message.channel.send(emoji4 + emoji5 + emoji6);
    line2.react('4️⃣'); line2.react('5️⃣'); line2.react('6️⃣');

    let line3 = await message.channel.send(emoji7 + emoji8 + emoji9);
    line3.react('7️⃣'); line3.react('8️⃣'); line3.react('9️⃣');

    client.on('messageReactionAdd', async (reaction, user) => {
      if (reaction.message.partial) await reaction.message.fetch();
      if (reaction.partial) await reaction.fetch();
      if (user.bot) return;
      if (!reaction.message.guild) return;
      if (user.id != roundPlayer.id) return;

      if (user.id == message.author.id) {player = p1Emoji}
      if (user.id == player2.id) {player = p2Emoji}

      if (reaction.message.id == line1.id) {

        if (reaction.emoji.name === '1️⃣') { emoji1 = player; }
        if (reaction.emoji.name === '2️⃣') { emoji2 = player; }
        if (reaction.emoji.name === '3️⃣') { emoji3 = player; }

        line1.edit(emoji1 + emoji2 + emoji3);
        round = round + 1;
      }

      if (reaction.message.id == line2.id) {
        if (reaction.emoji.name === '4️⃣') { emoji4 = player; }
        if (reaction.emoji.name === '5️⃣') { emoji5 = player; }
        if (reaction.emoji.name === '6️⃣') { emoji6 = player; }

        line2.edit(emoji4 + emoji5 + emoji6);
        round = round + 1;
      }

      if (reaction.message.id == line3.id) {
        if (reaction.emoji.name === '7️⃣') { emoji7 = player; }
        if (reaction.emoji.name === '8️⃣') { emoji8 = player; }
        if (reaction.emoji.name === '9️⃣') { emoji9 = player; }

        line3.edit(emoji7 + emoji8 + emoji9);
        round = round + 1;
      }

      if(round % 2 == 0) {roundPlayer = player2 }
      else {roundPlayer = player1}

      var editEmbed = new Discord.MessageEmbed()
        .setColor('#f0f0f0')
        .setTitle('❎Jogo da Velha⭕')
        .addFields({name: 'Vez de:', value: `${roundPlayer}`}, {name: 'jogada n°:', value: round});

      messageEmbed.edit(editEmbed);

/*

    //  P1 Win //

    //horizontal win p1
      if ((emoji1 == p1Emoji && emoji2 == p1Emoji && emoji3 == p1Emoji) || (emoji4 == p1Emoji && emoji5 == p1Emoji && emoji6 == p1Emoji) || (emoji7 == p1Emoji && emoji8 == p1Emoji && emoji9 == p1Emoji))  {
        message.channel.send(`Parabéns ${message.author}, você venceu! [horizontal]`)
      }

      //vertical win p1
      if ((emoji1 == p1Emoji && emoji4 == p1Emoji && emoji7 == p1Emoji) || (emoji2 == p1Emoji && emoji5 == p1Emoji && emoji8 == p1Emoji) || (emoji3 == p1Emoji && emoji6 == p1Emoji && emoji9 == p1Emoji)) {
        message.channel.send(`Parabéns ${message.author}, você venceu! [vertical]`)
      }

      //diagonal win p1
      if( (emoji1 == p1Emoji && emoji5 == p1Emoji && emoji9 == p1Emoji) || (emoji3 == p1Emoji && emoji5 == p1Emoji && emoji7 == p1Emoji) ){
        message.channel.send(`Parabéns ${message.author}, você venceu! [diagonal]`)
      }

    // P2 Win //

    //horizontal win p2
      if ((emoji1 == p2Emoji && emoji2 == p2Emoji && emoji3 == p2Emoji) || (emoji4 == p2Emoji && emoji5 == p2Emoji && emoji6 == p2Emoji) || (emoji7 == p2Emoji && emoji8 == p2Emoji && emoji9 == p2Emoji))  {
        message.channel.send(`Parabéns ${player2}, você venceu! [horizontal]`)
      }

      //vertical win p2
      if ((emoji1 == p2Emoji && emoji4 == p2Emoji && emoji7 == p2Emoji) || (emoji2 == p2Emoji && emoji5 == p2Emoji && emoji8 == p2Emoji) || (emoji3 == p2Emoji && emoji6 == p2Emoji && emoji9 == p2Emoji)) {
        message.channel.send(`Parabéns ${player2}, você venceu! [vertical]`)
      }

      //diagonal win p2
      if( (emoji1 == p2Emoji && emoji5 == p2Emoji && emoji9 == p2Emoji) || (emoji3 == p2Emoji && emoji5 == p2Emoji && emoji7 == p2Emoji)){
        message.channel.send(`Parabéns ${player2}, você venceu! [diagonal]`)
      }

      if ( (emoji1 != emptyEmoji) && (emoji2 != emptyEmoji) && (emoji3 != emptyEmoji) && (emoji4 != emptyEmoji) && (emoji5 != emptyEmoji) && (emoji6 != emptyEmoji) && (emoji7 != emptyEmoji) && (emoji8 != emptyEmoji) && (emoji9 != emptyEmoji)) {
        message.channel.send(`${player1} ${player2}\nEmpate. bom jogo.`);
      }

      */

    }
    )

  }
}