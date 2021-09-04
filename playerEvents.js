const { Player } = require('discord-player');
const Discord = require('discord.js');
/**
 * @param {Player} player 
 */
module.exports = async (player) => {

    player
        .on('trackStart', async (queue, track) => {
            let embed = new Discord.MessageEmbed()
                .setColor('NAVY')
                .setThumbnail(track.thumbnail)
                .addFields(
                    { name: '🎶 Reproduzindo', value: `${track.title} || \`${track.duration}\`` },
                    { name: 'Requisitado por', value: track.requestedBy.toString() }
                )
            queue.metadata.channel.send({ embeds: [embed] })

        })
        .on('trackAdd', async (queue, track) => {
            let embed = new Discord.MessageEmbed()
                .setColor('NAVY')
                .setThumbnail(track.thumbnail)
                .addFields(
                    { name: '🎶 Adicionado a lista de reprodução ⏳', value: `${track.title} || \`${track.duration}\`` },
                    { name: 'Requisitado por', value: track.requestedBy.toString() }
                )
            queue.metadata.channel.send({ embeds: [embed] })

        })
        .on('tracksAdd', async (queue, tracks) => {

            let embed = new Discord.MessageEmbed()
                .setColor('NAVY')
                .setTitle('🎶 Playlist adicionada a lista de reprodução ⏳')

            let description = '**Requisitado por: ' + tracks[0].requestedBy.toString() + '** \n\n';
            let i = 1;

            for (const track of tracks) {

                description += `${i}・${track.title} || \`${track.duration}\`\n\n`

                i++
            }

            embed.setDescription(description)


            queue.metadata.channel.send({ embeds: [embed] })

        })
        .on('trackStart', async (queue, tracks) => {

            let embed = new Discord.MessageEmbed()
                .setColor('NAVY')
                .setTitle('🎶 Playlist adicionada a lista de reprodução ⏳')

            let description = '**Requisitado por: ' + tracks[0].requestedBy.toString() + '** \n\n';
            let i = 1;

            for (const track of tracks) {

                if (i == 1) {
                    description += `**Reproduzindo agora:**\n ${track.title} || \`${track.duration}\`\n\n**A seguir:**\n\n`
                } else {
                    description += `${i}・${track.title} || \`${track.duration}\`\n\n`
                }


                i++
            }

            embed.setDescription(description)


            queue.metadata.channel.send({ embeds: [embed] })

        })
        .on('botDisconnect', async queue => {
            let embed = new Discord.MessageEmbed()
                .setColor('NAVY')
                .setTitle('desconectado do canal de voz')
                .setDescription('Tchau, até mais')

            queue.metadata.channel.send({ embeds: [embed] })
        })
        .on('channelEmpty', async queue => {
            let embed = new Discord.MessageEmbed()
                .setColor('NAVY')
                .setTitle('Canal de voz vazio')
                .setDescription('Se ninguém entrar no canal de voz em 1 minuto, eu irei me desconectar')

            queue.metadata.channel.send({ embeds: [embed] })
        })
        .on('error', async (queue, error) => {
            console.error(error);
            queue.metadata.channel.send({ content: `Houve um erro no player de música. Erro:\n${error}` })
        })

}