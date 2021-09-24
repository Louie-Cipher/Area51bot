const Discord = require('discord.js');

module.exports = {
  name: 'correio',
  aliases: ['cupido'],
  description: "envia sua mensagem amorosa no chat \"correio amoroso\"",
  dmAllow: true,
  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */
  async execute(client, message, args) {

    const isDM = message.channel.type == 'DM' ? true : false;

    if (!args[0]) {
      let reply = await message.reply({
        embeds: [{
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

    let texto = ''

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

    let aproveChannel = await client.channels.fetch('873198743405600798');

    let aproveEmbed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Novo Correio Amoroso')
      .setDescription(texto)
      .addField('Mensagem de', `${message.author}`)
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
        color: 'GREEN',
        title: 'Mensagem enviada com sucesso',
        description: 'Aguardando aprovação de um Cupido da staff para a mensagem ser publicada no chat Correio Amoroso',
      }]
    });

    try { message.delete(); } catch (err) { }

    setTimeout(() => {
      reply.delete()
    }, 4 * 1000);

    aproveChannel.send({ embeds: [aproveEmbed], components: [buttons] });


  }
}