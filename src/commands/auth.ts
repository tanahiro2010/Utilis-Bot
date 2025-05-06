import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, ButtonStyle, Role, ActionRowBuilder, ButtonBuilder, Colors } from "discord.js";
import { createButton } from "../models/button";
import { Command } from "../interface/command";

module.exports = {
    data: {
        name: "auth-board",
        description: "Authenticate with the bot",
        options: [
            {
                name: "role",
                description: "Role to assign to the user",
                type: ApplicationCommandOptionType.Role,
                required: true
            },
            {
                name: "title",
                description: "Title of the board",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "description",
                description: "Description of the board",
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },

    async execute(interaction: CommandInteraction): Promise<void> {
        const title = interaction.options.get("title")?.value as string || "Auth Board";
        const description = interaction.options.get("description")?.value as string || "Click the button below to authenticate you.";
        const role: Role = interaction.options.get("role")?.role as Role;

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(title)
            .setDescription(description);

        const button = createButton("Authenticate", JSON.stringify({ action: "auth", roleId: role.id }), ButtonStyle.Primary);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await interaction.followUp({ embeds: [embed], components: [row] });
        return;
    }
} as Command;