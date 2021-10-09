const Discord = require('discord.js');
/**
 * @param {Discord.Client} client
 * @param {Discord.VoiceState} oldState
 * @param {Discord.VoiceState} newState
 */
module.exports = async (client, oldState, newState) => {

    if (newState.member.user.bot) return;

    let newChannel = newState.channel;
    let oldChannel = oldState.channel;

    if ((oldChannel != newChannel) && newChannel != undefined) {

        const limit = newChannel.userLimit;
        if (limit == 0) return;

        if (limit < newChannel.members.size) {

            let logChannel = newState.guild.channels.cache.get('865038662306627605');
            let member = newState.guild.members.cache.get(newState.id);

            let logEmbed = new Discord.MessageEmbed()
                .setColor('#909000')
                .setTitle('Limite de call ultrapassado')
                .addFields(
                    { name: 'no canal', value: `${newChannel.name}` },
                    { name: 'usuário que entrou na call', value: `${member}` },
                    { name: 'limite da call', value: `${limit}` },
                    { name: 'membros na call', value: `${newChannel.members.size}` }
                );
            logChannel.send({ embeds: [logEmbed] });
        }
    }

    if (oldChannel.id == '886006766771519488' && (newChannel == undefined || newChannel.id == undefined)) {
        if (newState.member.voice.mute) newState.member.voice.setMute(false, 'saindo da call do RPG');
    }

}

