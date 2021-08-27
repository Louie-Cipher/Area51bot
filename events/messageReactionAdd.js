const Discord = require('discord.js')

module.exports = {

  async event(client, reaction, user) {

    if (reaction.partial) { //this whole section just checks if the reaction is partial
    try {
      await reaction.fetch(); //fetches reaction because not every reaction is stored in the cache
    } catch (error) {
      console.error('Fetching message failed: ', error);
        return;
      }
    }

    if (reaction.emoji.toString() == '✨') {
      if(user.bot) return;
      require('../reactionEvents/coin').trigger(client, reaction, user);
    }

    if(reaction.message.author.id != client.user.id) return;
    if(user.bot) return;

    let cupidoChannel = '873198743405600798'

    if(reaction.message.channel.id == cupidoChannel && reaction.emoji.toString() == '💌') {
      try{
      require('../reactionEvents/cupido').trigger(client, reaction, user)
      } catch{
        console.error()
      }
    }

    const hateChannel = '874146568930983936'

    if(reaction.message.channel.id == hateChannel && reaction.emoji.toString() == '🤬') {
      try{
      require('../reactionEvents/hate').trigger(client, reaction, user)
      } catch{
        console.error()
      }
    }

    const desabafoChannel = '880547880065187901'

    if(reaction.message.channel.id == desabafoChannel && reaction.emoji.toString() == '💭') {
      try{
      require('../reactionEvents/desabafo').trigger(client, reaction, user)
      } catch{
        console.error()
      }
    }
  

  }

}