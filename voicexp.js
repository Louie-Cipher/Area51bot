const profileModel = require('./mongoSchema/profile');
module.exports = {

  name: 'Voice XP',

  async voiceXpAdd(client) {

    //console.log('-- Voice XP checking--');

    var randomVoiceXP = Math.ceil(Math.random() * 3) + 2;

    //console.log(randomVoiceXP)

    let guild = client.guilds.cache.get('768565432663539723');

    for (const channel of guild.channels.cache) {

      if (channel.type == 'GUILD_VOICE' && channel.members.size > 1) {
        for (const member of channel.members) {
          if(!member.user.bot && !member.voice.mute && !member.voice.deaf) {

            let profileData = await profileModel.findOne({userID: member.user.id});

            if(!profileData) {
              let profileNew = await profileModel.create({
                userID: message.author.id,
                chatXP: 1,
                voiceXP: 1,
                coins: 100,
                bank: 200,
                lastEditXP: Date.now(),
                lastEditMoney: Date.now(),
                lastDaily: Date.now(),
                created: Date.now()
              });
              profileNew.save();
            }
            else {
            
            let profileUpdate = await profileModel.findOneAndUpdate(
              { userID: member.user.id },
              {
                inc: {voiceXP: randomVoiceXP},
                lastEditXP: Date.now()
              }
            )
            profileUpdate.save();
            }


          }
        }
      }
    }

  }
}


