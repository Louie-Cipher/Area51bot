const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { player } = require('../../index')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('reproduz uma música através de um link ou termo de pesquisa')
        .addStringOption(option =>
            option.setName('música')
                .setDescription('o link ou nome da música')
                .setRequired(true)),

    inVoiceChannel: true,
    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ephemeral: true});

        let music = await interaction.options.getString('música', true);
        let queue = await player.getQueue(interaction.guild);

        if (!queue) {
            queue = player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                }
            });
        }

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.editReply({ content: 'Não foi possível entrar no canal de voz "' + interaction.member.voice.channel.name + '"'});
        }

        const searchResult = await player
        .search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })
        .catch(() => {});

        if (!searchResult) return await interaction.editReply({ content: `❌ | Não foi possível achar a música "${query}"` });

        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);

        await interaction.editReply({ content: '🎶 Música adicionada 🎶', ephemeral: true })


    }
}