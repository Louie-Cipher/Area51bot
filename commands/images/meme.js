const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  name: 'meme',
  aliases: ['mememaker', 'memegenerator', 'memes'],
  description: "gerador de meme atraves de uma imagem anexada",

  async execute(client, message, args) {

    const msgCtt = message.content

    let image

    if (!message.attachments && (!msgCtt.startsWith('https://i.imgur.com/') && (!msgCtt.endsWith('.jpg') || !msgCtt.endsWith('.png') || !msgCtt.endsWith('.jpeg')))) return message.reply({
      embeds: [{
        color: '#f0ff00',
        description: 'você precisa anexar uma imagem ou enviar um link do imgur para gerar o meme'
      }]
    });
    if (!args[0]) return message.reply({
      embeds: [{
        color: '#f0ff00',
        title: 'você precisa escrever alguma frase para adcionar no meme',
        description: 'caso queira adcionar uma frase no topo da imagem, e uma frase em baixo, separe as frases com |'
      }]
    });

    if (message.attachments) {
      image = message.attachments[0]
    }
    else {
      image = args[0]
    }



    let template = await Canvas.loadImage(image);

    const canvas = Canvas.createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.font = `bold 18px sans-serif`;
    ctx.textAlign = "center";

    let text = args.join(' ')

    if (text.includes('|')) {
      let divideText = text.split('|')
      //            context |   text    |      X         |              Y                  | espaçamento |     largura
      printAtWordWrap(ctx, divideText[0], canvas.width / 2, canvas.heigth / 20, 20, (canvas.height / 2));
      printAtWordWrap(ctx, divideText[1], canvas.width / 2, canvas.heigth / 20 * (canvas.heigth / 18), 20, (canvas.height / 2));
    }
    else {
      printAtWordWrap(ctx, text, canvas.width / 2, canvas.heigth / 20 * (canvas.heigth / 18), 20, (canvas.height / 2));
    }



    function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {

      fitWidth = fitWidth || 0;

      if (fitWidth <= 0) {
        context.fillText(text, x, y);
        return;
      }
      var words = text.split(' ');
      var currentLine = 0;
      var idx = 1;
      while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0, idx).join(' ');
        var w = context.measureText(str).width;
        if (w > fitWidth) {
          if (idx == 1) {
            idx = 2;
          }
          context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
          currentLine++;
          words = words.splice(idx - 1);
          idx = 1;
        }
        else { idx++; }
      }
      if (idx > 0) context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
    }

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `meme.png`);
    message.reply({ files: [attachment] });

  }
}