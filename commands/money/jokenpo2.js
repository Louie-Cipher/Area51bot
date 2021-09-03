const Discord = require("discord.js")
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'jokenpo',
  aliases: ['ppt'],
  description: "apostar suas estrelas no pedra papel tesoura v2.0",

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    if (!args[0] || !args[1]) return message.reply({
      embeds: [{
        color: '#b3c20c',
        title: 'Você precisa mencionar alguém para desafiar, e colocar o valor da aposta',
        description: 'Exemplo: a.jokenpo @Louie 200'
      }]
    });

    let player1 = message.author;
    let player2 = message.mentions.users.first() || client.users.cache.get(args[0]);

    let valor = parseInt(args[1], 10);

    if (!player2) return message.reply({
      embeds: [{
        color: '#b3c20c', title: 'usuário informado não encontrado'
      }]
    });

    if (player2.bot)
      return message.reply({
        embeds: [{
          title: `${user.tag}`, description: 'Bip Bop | Bots não possuem perfil no Area51Bot'
        }]
      });

    if (player2.id === player1.id) return message.reply({
      embeds: [{
        title: 'Você não pode apostar consigo mesmo!',
        description: 'para apostar solo (contra o bot), use\n `a.pedra` ou `a.papel` ou `a.tesoura`'
      }]
    });

    if (valor < 1 || valor == NaN) return message.reply({
      embed: [{
        color: '#b3c20c',
        title: `O valor da aposta precisa ser um número inteiro (sem vírgula) e positivo`,
        description: 'Exemplo: a.jokenpo @pessoa 200'
      }]
    });

    let profileData1 = await profileModel.findOne({ userID: player1.id });
    let profileData2 = await profileModel.findOne({ userID: player2.id });

    if (!profileData2 && player2.id != client.user.id) return message.reply({
      embeds: [{
        color: '#b3c20c',
        title: 'usuário informado ainda não possui um perfil ou estrelas no bot'
      }]
    });

    if (profileData1.coins < valor) return message.reply({
      embeds: [{
        color: '#b3c20c',
        title: `Você não possui esse valor na carteira.`,
        description: `Você atualmente possui **${profileData1.coins} estrelas**`
      }]
    });
    if (player2.id != client.user.id && profileData2.coins < valor) return message.reply({
      embeds: [{
        color: '#b3c20c',
        title: `${player2.tag} não possui esse valor na carteira.`,
        description: `${player2.tag} atualmente possui **${profileData1.coins} estrelas**`
      }]
    });

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Pedra 🪨 papel 📃 tesoura ✂')
      .setDescription('Para escolher, clique nos botões abaixo')
      .addFields(
        { name: 'Jogador N°1', value: player1.toString() },
        { name: 'Jogador N°2', value: player2.toString() },
        { name: 'Valor', value: valor.toString() }
      )

    let buttons = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('pedra')
          .setLabel('pedra')
          .setEmoji('🪨')
          .setStyle('PRIMARY'),
        new Discord.MessageButton()
          .setCustomId('papel')
          .setLabel('papel')
          .setEmoji('📃')
          .setStyle('PRIMARY'),
        new Discord.MessageButton()
          .setCustomId('tesoura')
          .setLabel('tesoura')
          .setEmoji('✂')
          .setStyle('PRIMARY'),
        new Discord.MessageButton()
          .setCustomId('recusar')
          .setLabel('recusar')
          .setStyle('DANGER')
          .setEmoji('❌')
      );

    let player1Value = 0;
    let player2value = 0;

    let players = 0;

    let mainMessage = await message.channel.send({
      content: `${player2}. ${player1} deseja apostar **${valor}** estrelas com você`,
      embeds: [embed],
      components: [buttons]
    })

    client.on('interactionCreate', async interaction => {

      if (!interaction.inGuild()) return;
      if (!interaction.isButton()) return;
      if (interaction.message.id != mainMessage.id) return;
      if (interaction.member.id != player1.id || interaction.member.id != player2.id) return;

      interaction.deferReply({ephemeral: true})

      if (interaction.member.id == player1.id && interaction.customId != 'recusar' && player1Value == 0) {

        interaction.editReply({ ephemeral: true, content: `Você jogou ${interaction.customId}!\nAguardando o outro jogador...` });
        player1Value = interaction.customId;
        players++

      } else if (interaction.member.id == player2.id && interaction.customId != 'recusar' && player1Value == 0) {

        interaction.editReply({ ephemeral: true, content: `Você jogou ${interaction.customId}!\nAguardando o outro jogador...` });
        player2value = interaction.customId
        players++

      } else if (interaction.member.id == player2.id && interaction.customId == 'recusar') {
        interaction.editReply({ ephemeral: true, content: `Você recusou a aposta` });
        return mainMessage.edit({ embeds: [{ description: `❎ ${player2} recusou a aposta` }] })
      }

      if (players == 2) {

        let resultEmbed = new Discord.MessageEmbed()
          .setColor('GREYPLE')
          .setTitle('Pedra 🪨 papel 📃 tesoura ✂')

        let description = `${player1} jogou ${player1Value}\n${player2} jogou ${player2value}\n\n`

        if (player1Value == player2value) {

          description += 'Foi um empate! 🤝 \nNinguém ganhou ou perdeu estrelas'

        } else if (
          (player1Value == 'pedra' && player2value == 'tesoura') ||
          (player1Value == 'papel' && player2value == 'pedra') ||
          (player1Value == 'tesoura' && player2value == 'papel')
        ) {

          description += `🎉 ${player1} venceu. parabéns! ganhou ${valor} estrelas\n😭 ${player2} perdeu. sinto muito. perdeu ${valor} estrelas`

          let profileUpdate1 = await profileModel.findOneAndUpdate(
            {
              userID: player1.id,
            }, {
            $inc: {
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
            $inc: {
              coins: -valor
            },
            lastEditMoney: Date.now()
          }
          );
          profileUpdate2.save();

        } else if (
          (player1Value == 'pedra' && player2value == 'papel') ||
          (player1Value == 'papel' && player2value == 'tesoura') ||
          (player1Value == 'tesoura' && player2value == 'pedra')
        ) {

          description += `🎉 ${player2} venceu. parabéns! ganhou ${valor} estrelas\n😭 ${player1} perdeu. sinto muito. perdeu ${valor} estrelas`

          let profileUpdate1 = await profileModel.findOneAndUpdate(
            {
              userID: player1.id,
            }, {
            $inc: {
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
            $inc: {
              coins: valor
            },
            lastEditMoney: Date.now()
          }
          );
          profileUpdate2.save();

        }

        resultEmbed.setDescription(description);


        mainMessage.edit({
          content: `Resultado da aposta de ${player1} e ${player2}`,
          embeds: [resultEmbed]
        })


      }




    })

  }
}