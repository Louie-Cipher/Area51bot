const Discord = require('discord.js');

module.exports = {
  name: 'desabafo',
  aliases: ['desabafar'],
  description: "envia sua mensagem de desabafo no chat \"desabafos\"",
  dmAllow: true,

  async execute(client, message, args) {

    if (!args[0]) return message.reply({
      embeds: [{
        color: '#ff00a2',
        title: 'Chat de desabafo',
        description: `digite sua mensagem de desabafo junto com o comando`,
        footer: {
          text: `Obs: por padrão, as mensagens de desabafo são pseudo-anônimas\n(apenas a staff pode ver o remetente, para evitar usos indevidos do comando. o remetente não irá ser mostrado publicamente no chat de desabafo)\nmas caso queira se identificar, apenas acrescente seu nome na própria mensagem onde quiser`
        }
      }]
    })

    let totalMessage = args.join(' ');
    let texto
    let destinatario

    for (const argm of args) {

      if (argm.length == 18) {

        i = 0
        argm.split('').forEach(letter => {
          if (Number(letter) != NaN) i++
        })

        if (i == 18) { texto += `<@${argm}> ` }
        else { texto += argm }

      }
      else if (argm == undefined || argm == 'undefined') { }
      else if (argm == '@everyone') { texto += `@ everyone ` }
      else {
        texto += `${argm} `
      }

    }

    if (texto.length > 2048) return message.reply({ embeds: [{ color: '#ff00a2', description: `O tamanho limite das mensagens são de 2048 caracteres. sua mensagem possui ${texto.length} caracteres` }] })

    if (texto.startsWith('undefined')) {
      texto = texto.substring(9);
    }

    /*if(totalMessage.includes('|')) {
      
      texto = totalMessage.split('|')[0]

      if (totalMessage.split('|')[1].startsWith(' ')) { 
        destinatario = await client.users.cache.get(totalMessage.split('|')[1].substring(1));
      }
      else {
        destinatario = await client.users.cache.get(totalMessage.split('|')[1])
      }
    }
    else {
      texto = args.join(' ');
    }*/

    let aproveChannel = await client.channels.fetch('880547880065187901');

    message.react('✅')

    message.reply({
      embeds: [{
        color: '#00f000',
        title: 'Mensagem enviada com sucesso',
        description: 'Aguardando aprovação de um staff para a mensagem ser publicada no chat de desabafos',
      }]
    })

    let aproveEmbed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Nova mensagem de desabafo')
      .setDescription(texto)
      .addField('Mensagem de', message.author)
      .setFooter('Reaja com o emoji 💭 abaixo para aprovar essa mensagem');

    let aproveMessage = await aproveChannel.send({ embeds: [aproveEmbed] })

    aproveMessage.react('💭');

  }
}