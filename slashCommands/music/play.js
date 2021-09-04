const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('reproduz uma música através de um link ou termo de pesquisa')
        .addStringOption(option =>
            option.setName('música')
                .setDescription('o link ou nome da música')
                .setRequired(true)
        ),

    inVoiceChannel: true,
    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true });

        let music = await interaction.options.getString('música', true);
        let queue = await client.player.getQueue(interaction.guildId);

        if (!queue) {
            queue = client.player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                }
            });
        }

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.editReply({ content: 'Não foi possível entrar no canal de voz "' + interaction.member.voice.channel.name + '"' });
        }

        const searchResult = await client.player
            .search(music, {
                requestedBy: interaction.user
            })
            .catch(() => { });

        if (!searchResult) return await interaction.editReply({ content: `❌ | Não foi possível achar a música "${query}"` });

        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);

        await interaction.editReply({ content: '🎶 Música adicionada 🎶', ephemeral: true })


    }
}