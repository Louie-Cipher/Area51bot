const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji-game')
        .setDescription('tente achar o emoji diferente antes do tempo acabar')
        .addIntegerOption(input => input
            .setName('valor')
            .setDescription('Caso deseje apostar, informe o valor')
            .setRequired(false)
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: false });

        let betValue = interaction.options.getInteger('valor', false);
        let aposta = false;
        let profileData;

        if (betValue && betValue > 0) {
            aposta = true;
            try {
                profileData = await profileModel.findOne({ userID: interaction.user.id });
            } catch (err) {
                return interaction.editReply({ content: 'Ops, houve um erro de comunicação no banco de dados.\nTente novamente mais tarde' });
            }

            if (profileData.coins < betValue) return interaction.editReply({ content: 'Ei, você não possui esse valor em carteira para apostar' });
        }

        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

        const totalEmojis = [
            // Certo    // Diferente
            [':blush:', ':relaxed:'],
            [':man_office_worker:', ':office_worker:'],
            [':sleeping_accommodation:', ':bed:'], // 🛌 // 🛏️
            [':motorway:', '🛤️'], // 🛣️ // 🛤️
            [':station:', ':tram:'], // 🚉 // 🚊
            [':house_with_garden:', ':house:'], //🏡 // 🏠
            [':e_mail:', ':envelope:'], //📧 // ✉️
            [':file_folder:', ':open_file_folder:'], // 📁 // 📂
        ];

        let emojis = Array()

        let diferente = String()

        function newBoard() {
            let board = ':black_large_square: :one: :two: :three: :four: :five: :six: :seven: :eight: :nine:\n';

            emojis = totalEmojis[Math.floor(Math.random() * totalEmojis.length)];

            diferente = letters[Math.floor(Math.random() * letters.length)] + numbers[Math.floor(Math.random() * numbers.length)];

            for (const letter of letters) {
                board += `:regional_indicator_${letter}: `;

                for (let i = 1; i <= 9; i++) {

                    const position = `${letter}${i.toString()}`;

                    if (position != diferente) board += emojis[0] + ' '
                    else board += emojis[1] + ' '

                    if (i == 9) board += '\n'
                }
            }
            return board
        }

        let board = newBoard();

        let startEmbed = new Discord.MessageEmbed()
            .setColor('YELLOW')
            .setTitle('🔍 Ache o emoji diferente dos demais 🔎')
            .setDescription(board)
            .addField('Como jogar',
                `Você tem 30 segundos e 3 chances para achar o emoji diferente dos demais\nEnvie as coordenadas do emoji que é diferente\nExemplo: "A3" ou "B5"`
            )

        if (aposta === true) startEmbed.addField('Valor da aposta', `${betValue}`);

        let lucro = 0;
        let partidas = 1;
        let vitorias = 0;
        let derrotas = 0;
        let chances = 3;

        let playAgainButton = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('again')
                    .setLabel('Jogar Novamente')
                    .setStyle('SUCCESS')
                    .setEmoji('↩')
            );


        function isCoordinate(string) {
            const letras = string.split('');
            return letters.includes(letras[0].toLowerCase()) && numbers.includes(letras[1])
        }

        let gameMessage = await interaction.editReply({ embeds: [startEmbed], fetchReply: true });

        let timeEnd = new Date(Date.now() + (30 * 1000));

        let msgCollector = interaction.channel.createMessageCollector({
            filter: msg => msg.author.id == interaction.user.id && isCoordinate(msg.content) === true,
            time: 30 * 1000
        });

        /*setTimeout(() => {
            if (msgCollector.ended === true) return;

            let timeEmbed = new Discord.MessageEmbed(startEmbed).setDescription(board + '\n\n⌛ Faltam 15 segundos!');
            gameMessage.edit({ embeds: [timeEmbed] });

        }, 15 * 1000);*/

        msgCollector.on('collect', async message => {

            console.log(message.content)

            let timeLeft = new Date(timeEnd.getTime() - Date.now());

            const messagePermission = message.channel.permissionsFor(message.guild.me).has(Discord.Permissions.FLAGS.MANAGE_MESSAGES);
            setTimeout(() => {
                if (messagePermission === true) message.delete();
            }, 1000);

            if (message.content.toLowerCase() == diferente) return msgCollector.stop('win');

            chances--

            if (chances == 0) return msgCollector.stop('chances');

            const description = `\n\nOpa, esse não é o emoji diferente. tente novamente\nVocê ainda tem **${chances} chances** e **${timeLeft.getSeconds()} segundos**`
            let roundEmbed = new Discord.MessageEmbed()
                .setColor('YELLOW')
                .setTitle(startEmbed.title)
                .setDescription(board + description)

            gameMessage.edit({
                embeds: [roundEmbed]
            });

        }); // Message Collector event end
        msgCollector.on('end', (collection, reason) => {

            console.log(msgCollector.ended)

            console.log('terminado por: ' + reason)

            let description = '\n\n'

            let endEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle(startEmbed.title)

            if (reason == 'win') { //Collector finalizado por vitória
                vitorias++
                description += '🎉 Parabéns! Você acertou'
                endEmbed.setColor('GREEN')
            }
            else if (reason == 'time') { // Collector finalizado por fim do tempo
                derrotas++
                description += `😭 Sinto muito, o tempo acabou\nA resposta certa era **${diferente.toUpperCase()}**`
            }
            else if (reason == 'chances') { // Collector finalizado por fim das chances
                derrotas++
                description += `😭 Sinto muito, suas chances acabaram\nA resposta certa era **${diferente.toUpperCase()}**`
            }

            endEmbed.setDescription(board + description)
                /*.addFields(
                    { name: 'Partidas', value: `${partidas}`, inline: true },
                    { name: 'Vitórias', value: `${vitorias}`, inline: true },
                    { name: 'Derrotas', value: `${derrotas}`, inline: true },
                );*/

            gameMessage.edit({
                embeds: [endEmbed],
                //components: [playAgainButton]
            });

            partidas++

        }); // Message Collector end event end
/*
        
        let buttonCollector = gameMessage.createMessageComponentCollector({
            filter: int => int.isButton() && int.user.id == interaction.user.id
        });
        
        buttonCollector.on('collect', async buttonInteraction => {

            

        });*/

    }
}