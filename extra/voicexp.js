const Discord = require('discord.js');
const profileModel = require('../mongoSchema/profile');

module.exports = {

  name: 'Voice XP',

  /**
   * @param {Discord.Client} client
   */

  async voiceXpAdd(client) {

    console.log('-- Voice XP checking--');

    var randomVoiceXP = Math.floor(Math.random() * 2) + 1;

    let guild = client.guilds.cache.get('768565432663539723');

    for (let channel of guild.channels.cache) {

      if (channel[1].type == 'GUILD_VOICE' && channel[1].members.size > 1) {

        for (let member of channel[1].members) {

          if (!member[1].user.bot && !member[1].voice.mute && !member[1].voice.deaf) {

            console.log('---membro---');
            console.log(member[1].user.tag);

            let profileData = await profileModel.findOne({ userID: member[0] });


            if (!profileData) {
              let profileNew = await profileModel.create({
                userID: member[0],
                chatXP: 1,
                voiceXP: randomVoiceXP,
                coins: 100,
                bank: 200,
                lastRob: new Date(946684800000),
                lastWork: new Date(946684800000),
                lastEditXP: Date.now(),
                lastEditMoney: Date.now(),
                lastDaily: Date.now(),
                created: Date.now()
              });
              profileNew.save();
            }
            else {

              let profileUpdate = await profileModel.findOneAndUpdate(
                { userID: member[0] },
                {
                  $inc: { voiceXP: randomVoiceXP },
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


