import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, ButtonStyle, Role, ActionRowBuilder, ButtonBuilder, Colors, MessageFlags } from "discord.js";
import { createButton } from "../models/button";
import { Command } from "../interface/command";

module.exports = {
    data: {
        name: "auth-board",
        description: "Authenticate with the bot",
        flags: 0,
        options: [
            {
                name: "role",
                description: "Role to assign to the user",
                type: ApplicationCommandOptionType.Role,
                required: true
            },
            {
                name: "title",
                description: "Title of the board. default: Auth Board",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "description",
                description: "Description of the board. default: Click the button below to authenticate you.",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "button-text",
                description: "Text of the button. default: Authenticate",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "button-style",
                description: "Style of the button. default: Primary",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [
                    { name: "Primary", value: ButtonStyle.Primary.toString() },
                    { name: "Secondary", value: ButtonStyle.Secondary.toString() },
                    { name: "Success", value: ButtonStyle.Success.toString() },
                    { name: "Danger", value: ButtonStyle.Danger.toString() },
                    { name: "Link", value: ButtonStyle.Link.toString() }
                ]
            }
        ]
    },

    async execute(interaction: CommandInteraction): Promise<void> {
        const title = interaction.options.get("title")?.value as string || "Auth Board";
        const description = interaction.options.get("description")?.value as string || "Click the button below to authenticate you.";
        const role: Role = interaction.options.get("role")?.role as Role;
        const buttonText = interaction.options.get("button-text")?.value as string || "Authenticate";
        const buttonStyle = interaction.options.get("button-style")?.value as ButtonStyle || ButtonStyle.Primary;

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(title)
            .setDescription(`${description}\n付与ロール: <@&${role.id}>`);

        const button = createButton(buttonText, JSON.stringify({ data: { action: "auth", flags: MessageFlags.Ephemeral }, value: { roleId: role.id } }), buttonStyle);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await interaction.followUp({ embeds: [embed], components: [row] });
        return;
    }
} as Command;