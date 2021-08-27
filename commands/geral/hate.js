const Discord = require('discord.js');

module.exports = {
  name: 'hate',
  aliases: ['odio', 'ódio'],
  description: "envia sua cartinha do ódio no chat \"correio do ódio\"",
  dmAllow: true,

  async execute(client, message, args) {

    if(!args[0]) return message.channel.send({embed: {
      color: '#ff00a2',
      title: 'Correio do Ódio',
      description: `digite sua carta do hate junto com o comando
      caso deseje mencionar o destinatário, informe o ID na parte que deseja mencionar

      **exemplo:**
      a.hate para 862104838161956894 cartinha do ódio aqui, vai tomar...

      essa mensagem de exemplo sairia como:
      "para @Area51bot cartinha do ódio aqui, vai tomar..."`,
      footer: {
        text: `Obs: por padrão, o correio é pseudo-anônimo\n(apenas a staff pode ver o remetente, para evitar usos indevidos do comando, não irá ser mostrado publicamente no chat Correio do Ódio)\nmas caso queira se identificar, apenas acrescente seu nome na própria mensagem onde quiser`
	    }
    }})

    let totalMessage = args.join(' ');
    let texto
    let destinatario

    for (const argm of args) {

      if(argm.length == 18 || (argm.length == 20 && argm.endsWith('\n'))) {
        
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

    if (texto.length > 2048) return message.channel.send({embed: { color: '#ff00a2', description: `O tamanho limite do correio é de 2048 caracteres. sua mensagem possui ${texto.length} caracteres` }})

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

    let aproveChannel = await client.channels.fetch('874146568930983936');

    message.react('✅')

    message.channel.send({embed: {
      color: '#00f000',
      title: 'Mensagem enviada com sucesso',
      description: 'Aguardando aprovação de um mensageiro da staff para a mensagem ser publicada no chat Correio do Ódio',
    }})

    let aproveEmbed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Novo Correio do Ódio')
      .setDescription(texto) 
      .addField('Mensagem de', message.author)
      .setFooter('Reaja com o emoji 🤬 abaixo para aprovar essa mensagem');

    let aproveMessage = await aproveChannel.send(aproveEmbed)

    aproveMessage.react('🤬');

  }
}