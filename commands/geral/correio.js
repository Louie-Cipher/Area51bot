const Discord = require('discord.js');

module.exports = {
  name: 'correio',
  aliases: ['cupido'],
  description: "envia sua mensagem amorosa no chat \"correio amoroso\"",
  dmAllow: true,

  async execute(client, message, args) {

    if(!args[0]) return message.reply({embeds: [{
      color: '#ff00a2',
      title: 'Correio Amoroso',
      description: `digite sua carta do correio amoroso junto com o comando
      caso deseje mencionar o destinatário, informe o ID na parte que deseja mencionar

      **exemplo:**
      a.correio para 862104838161956894 uma carta do correio amoroso aqui

      essa mensagem de exemplo sairia como:
      "para @Area51bot uma carta do correio amoroso aqui, com muito amor"`,
      footer: {
        text: `Obs: por padrão, o correio elegante é pseudo-anônimo\n(apenas a staff pode ver o remetente, para evitar usos indevidos do comando, não irá ser mostrado publicamente no chat Correio Amoroso)\nmas caso queira se identificar, apenas acrescente seu nome na própria mensagem onde quiser`
	    }
    }]})

    let totalMessage = args.join(' ');
    let texto
    let destinatario

    for (const argm of args) {

      if(argm.length == 18) {
        
        i=0
        argm.split('').forEach(letter => {
          if(Number(letter) != NaN) i++
        })

        if(i==18) { texto += `<@${argm}> ` }
        else { texto += argm }

      }
      else if (argm == undefined || argm == 'undefined') {  }
      else if (argm == '@everyone') {texto += `@ everyone `}
      else {
        texto += `${argm} `
      }

    }

    if (texto.length > 2048) return message.reply({embeds: [{ color: '#ff00a2', description: `O tamanho limite do correio é de 2048 caracteres. sua mensagem possui ${texto.length} caracteres` }]})

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

    let aproveChannel = await client.channels.fetch('873198743405600798');

    message.react('✅')

    message.reply({embeds: [{
      color: '#00f000',
      title: 'Mensagem enviada com sucesso',
      description: 'Aguardando aprovação de um Cupido da staff para a mensagem ser publicada no chat Correio Amoroso',
    }]})

    let aproveEmbed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Novo Correio Amoroso')
      .setDescription(texto) 
      .addField('Mensagem de', message.author.toString())
      .setFooter('Reaja com o emoji 💌 abaixo para aprovar essa mensagem');

    let aproveMessage = await aproveChannel.send({embeds: [aproveEmbed]})

    aproveMessage.react('💌');

  }
}