const Discord = require("discord.js");

module.exports = {
  name: 'ping',
  aliases: ['teste', 'speed'],
  description: "testa a Latência do bot",

  async execute(client, message, args) {
    const msg = await message.channel.send({embed: {
    color: 39423,
    title: "Ping"
    }});

    let embed = new Discord.MessageEmbed()
      .setColor('#00ff00')
      .setTitle('🏓 **| Pong!**')
      .addFields(
        {name:'Latência do Server:', value:`${msg.createdTimestamp -
      message.createdTimestamp}ms`},
      {name: 'Latência da API:', value: `${Math.round(client.ws.ping)}ms` }
      );
      
    msg.edit({embed: {
      title: '🏓 | Pong!',
      color: 39423,
      fields: [
        {name:'Latência do Server:', value:`${msg.createdTimestamp -
      message.createdTimestamp}ms`},
      {name: 'Latência da API:', value: `${Math.round(client.ws.ping)}ms` }]
    }});
    
  }
}