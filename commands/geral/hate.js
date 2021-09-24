const Discord = require('discord.js');

module.exports = {
  name: 'hate',
  aliases: ['odio', 'ódio'],
  description: "envia sua cartinha do ódio no chat \"correio do ódio\"",
  dmAllow: true,

  async execute(client, message, args) {

    const isDM = message.channel.type == 'DM' ? true : false;

    if (!args[0]) {
      let reply = await message.reply({
        embeds: [{
          color: '#ff00a2',
          title: 'Correio do Ódio',
          description: `digite sua carta do hate junto com o comando
        caso deseje mencionar o destinatário, informe o ID na parte que deseja mencionar
  
        **exemplo:**
        a.hate para 862104838161956894 cartinha do ódio aqui, te odeio
  
        essa mensagem de exemplo sairia como:
        "para @Area51bot cartinha do ódio aqui, te odeio"`,
          footer: {
            text: `Obs: por padrão, o correio é pseudo-anônimo\n(apenas a staff pode ver o remetente, para evitar usos indevidos do comando, não irá ser mostrado publicamente no chat Correio do Ódio)\nmas caso queira se identificar, apenas acrescente seu nome na própria mensagem onde quiser`
          }
        }]
      });

      if (isDM === false) {
        try { message.delete() } catch (err) { }
        setTimeout(() => {
          try { reply.delete() } catch (err) { }
        }, 10 * 1000);
      }
      return;
    }

    let texto

    for (const word of args) {

      if (word.length == 18) {

        const snowFlake = Discord.SnowflakeUtil.deconstruct(word)

        if (snowFlake && snowFlake.date) texto += `<@${word}> `
        else texto += word

      }
      else if (word == undefined || word == 'undefined') { }
      else if (word == '@everyone') texto += `@ everyone `
      else texto += `${word} `

    }

    if (texto.length > 2048) {
      let reply = await message.reply({ embeds: [{ color: '#ff00a2', description: `O tamanho limite do correio é de 2048 caracteres. sua mensagem possui ${texto.length} caracteres` }] })

      if (isDM === false) {
        try { message.delete() } catch (err) { }
        setTimeout(() => {
          try { reply.delete() } catch (err) { }
        }, 10 * 4000);
      }

      return;

    }
    if (texto.startsWith('undefined')) texto = texto.substring(9);

    let aproveChannel = await client.channels.fetch('874146568930983936');

    let aproveEmbed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Novo Correio do Ódio')
      .setDescription(texto)
      .addField('Mensagem de', message.author)
      .setFooter('Clique no botão abaixo para aprovar essa mensagem');

    let buttons = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('aprovar')
          .setLabel('Aprovar')
          .setStyle('PRIMARY')
          .setEmoji('✅')
      );

    let reply = await message.reply({
      embeds: [{
        color: '#00f000',
        title: 'Mensagem enviada com sucesso',
        description: 'Aguardando aprovação de um mensageiro da staff para a mensagem ser publicada no chat Correio do Ódio',
      }]
    });

    try { message.delete(); } catch (err) { }

    setTimeout(() => {
      reply.delete()
    }, 4 * 1000);

    aproveChannel.send({ embeds: [aproveEmbed], components: [buttons] });

  }
}