const Canvas = require("canvas");
const Discord = require('discord.js');

module.exports = {
  name: 'button',
  aliases: ['buttons', 'botão', 'botões', 'botao', 'botoes'],
  description: "gera um meme de escolher o botão com as frases informadas",

  async execute(client, message, args) {

    let helpEmbed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('meme - escolha botões')
      .setDescription('escreva as frases para o formar o meme junto com o comando\nsepare as frases usando | (barra vertical)')
      .addFields(
        {name: 'primeira frase', value: 'primeiro botão'},
        {name: 'segunda frase', value: 'segundo botão'},
        {name: 'terceira frase', value: 'a pessoa escolhendo os botões'}
      );

    if(!args[1]) return message.channel.send(helpEmbed);

    var txt = args.join(' ').split('|');

    const template = await Canvas.loadImage('https://imgflip.com/s/meme/Two-Buttons.jpg');

    const canvas = Canvas.createCanvas(template.width/2, template.height/2);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.font = `bold 20px sans-serif`;
    ctx.textAlign = "center";

    //           context | text |      X       |           Y          | espaçamento |   largura

    //  botão 1  //
    ctx.rotate(6.02);
    printAtWordWrap(ctx, txt[0],  canvas.width/4 - 30,         80,                  20,  100);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    //  botão 2 //
    ctx.rotate(6.02);
    printAtWordWrap(ctx, txt[1],  (canvas.width/2),   95,                  20,  100);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    //  pessoa  //
    if(txt[2]) {
      printAtWordWrap(ctx, txt[2],  canvas.width/2,         canvas.height - 70,   20,  (canvas.height/2) - 30);
    }

  function printAtWordWrap( context , text, x, y, lineHeight, fitWidth) {

    fitWidth = fitWidth || 0;
    
    if (fitWidth <= 0)
    {
        context.fillText( text, x, y );
        return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0,idx).join(' ');
        var w = context.measureText(str).width;
        if ( w > fitWidth )
        {
            if (idx==1)
            {
                idx=2;
            }
            context.fillText( words.slice(0,idx-1).join(' '), x, y + (lineHeight*currentLine) );
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
        }
        else
        {idx++;}
      }
    if (idx > 0) context.fillText( words.join(' '), x, y + (lineHeight*currentLine) );
  }


    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `button.png`);
    message.channel.send(attachment);

  }
}