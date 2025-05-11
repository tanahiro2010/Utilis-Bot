import { EmbedBuilder, Colors, CommandInteraction, MessageFlags } from "discord.js";
import { Command } from "../interface/command";

module.exports = {
    data: {
        name: "invite",
        description: "Send the bot url.",
        flags: MessageFlags.Ephemeral
    },

    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle("Invite url")
            .setDescription("https://discord.com/oauth2/authorize?client_id=1368873633904070735&permissions=8&integration_type=0&scope=bot+applications.commands");

        await interaction.followUp({ embeds: [embed] });
    },
} as Command;