const Discord = require('discord.js');
const Distube = require('distube');

module.exports = {
  name: 'skip',
  aliases: ['pular', 'pulo', 'avancar', 'avançar'],
  description: "pula a música em reprodução",
  inVoiceChannel: true,

  /** 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {String[]} args
 */

  async execute(client, message, args) {

    let voiceChannel = message.member.voice.channel.members

    if (!message.member.permissions.has('MUTE_MEMBERS') && voiceChannel.size > 2) {

      let voteRequired = Math.ceil(voiceChannel.size / 2)

      message.reply({
        embeds: [{
          title: `🗳 | Para pular a música, são necessários mais ${voteRequired - 1} votos`,
          description: 'Para votar, envie `skip` nesse canal',
          footer: { text: 'O número de votos necessários equivale a 50% dos membros + 1 que estão na call' }
        }]
      });

      let votes = [message.author.id];

      /**
      * @param {Discord.Message} msg 
      */
      const filter = msg => {
        msg.content.toLowerCase().includes('skip') && voiceChannel.has(msg.author.id) && !msg.author.bot
      }

      const collector = message.channel.createMessageCollector({ filter, time: 60 * 1000 });
      const start = new Date();

      collector.on('collect', async collectMessage => {

        let dateNow = new Date()
        let timeLeft = 60 - (new Date(dateNow.getTime() - start.getTime()).getSeconds())

        if (!votes.includes(collectMessage.author.id)) {

          votes.push(collectMessage.author.id);

          message.reply({ content: `✅🗳 | Você votou para pular a música\nFaltam ${voteRequired - votes.length} votos para pular\nE faltam ${timeLeft} segundos para encerrar a votação` })
        } else {
          collectMessage.reply({
            embeds: [{
              description: `❌🗳 | Você já votou para pular a música, são necessários mais **${voteRequired - votes.length} votos**`,
              footer: { text: `faltam ${timeLeft} segundos para encerrar a votação` }
            }]
          })
        }


        if (votes.length >= voteRequired) {
          collector.stop();
          client.distube.skip(collectMessage);
          return collectMessage.channel.send({ embeds: [{ title: '✅🗳 | Votos suficientes - Música pulada ⏩' }] })
        }

      })
      collector.on('end', (collection, reason) => {
        if (reason != 'user') return message.channel.send({ embeds: [{ description: `❌🗳 Não houve votos suficientes (${collection.size} de ${voteRequired})\n fim da votação para pular` }] })
      })

    }
    else {

      const queue = client.distube.getQueue(message)
      if (!queue) return message.reply({ embeds: [{ description: 'Nenhuma música na lista de reprodução para avançar' }] })
      try {
        client.distube.skip(message);
        message.reply({ embeds: [{ description: '⏭ | Música pulada' }] })
      } catch (error) {
        message.reply(error)
      }

    }

  }
}