const Discord = require("discord.js");

module.exports = {
  name: 'jornal',
  aliases: ['jornalista'],
  description: "envia a mensagem pré-programada do jornal",
  userPermissions: 'ADMINISTRATOR',

  async execute(client, message, args) {
    
    let helloEmbed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('<a:aedgy_neonalien:833800891169243178> 📰 Olá. esse é o jornal intergalático 📰 <a:aedgy_neonalien:833800891169243178>')
      .setDescription(`O novo canal de anúncios do servidor Área 51, onde iremos trazer curiosidades,
      e notícias diversas de coisas legais que acontecem dentro e fora do servidor, e do discord`)

    let youtubeEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Youtube Premium grátis por 3 meses')
      .setDescription(`**Olá leitores intergaláticos. Inaugurando nosso jornal intergalático, uma rápida notícia para vocês, uma novidade sobre Discord e Youtube:**
      **Todos os Assinantes do Discord Nitro receberam um teste do Youtube Premium por 3 meses.**

      Youtube Premium é a assinatura do Youtube que permite assistir vídeos sem anúncio, baixar vídeos para assistir offline, e outras funcionalidades.

      Para resgatar essa assinatura gratuita, basta ter Discord Nitro (sim, a assinatura Nitro oferecida pela Epic Games também está inclusa)

      **1・** Vá nas configurações do Discord 
      **2・** Abra a guia "Inventário de presentes"(no pc) ou "Presentear Nitro" (no celular)
      **3・** Clique em "ver código", e copie esse código
      **4・** acesse o link https://www.youtube.com/redeem e digite o código que você copiou
      **5・** Cadastre uma forma de pagamento. Atenção, após os 3 meses gratuitos, se você não cancelar a assinatura, o valor começará a ser cobrado nessa forma de pagamento
      **6・** Parabéns, você agora tem o Youtube premium gratuitamente por 3 meses`)
      .setThumbnail('https://static.pelando.com.br/live/threads/thread_large/default/433842_1.jpg')
      .setImage('https://beebom.com/wp-content/uploads/2021/08/How-to-Claim-3-Months-of-Free-YouTube-Premium-with-Discord-Nitro.jpg')
      .setFooter('por: Louie', message.author.displayAvatarURL({ format: "png" }))

      //message.channel.send(youtubeEmbed)

  }
}