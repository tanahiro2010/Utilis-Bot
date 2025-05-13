import { ActionRowBuilder, ApplicationCommandOptionType, Colors, CommandInteraction, EmbedBuilder, Guild, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { restoreChannels, restoreRoles } from "../utils/build";
import { readFileSync } from "fs";
import { Command, ModalCommand } from "../interface/command";
import { Config } from "../interface/guils";

module.exports = {
    data: {
        name: "build",
        description: "Build guild",
        defer: false,
        options: [
            {
                name: "use-sample",
                description: "If you use default template, you chose true",
                type: ApplicationCommandOptionType.Boolean,
                required: true
            }
        ]
    },

    async execute(interaction: CommandInteraction) {
        const useTemplate = interaction.options.get('use-sample')?.value;
        const { guild } = interaction;

        if (!guild) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription("Failed to fetch guild info.");

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        if (useTemplate) {
            const template: Config = JSON.parse(readFileSync(`./src/data/template.json`, { encoding: 'utf-8' }));
            const roles = await restoreRoles(guild as Guild, template.roles);
            console.log(roles);
            await restoreChannels(guild as Guild, template.channels, roles);
        } else {
            const modal = new ModalBuilder()
                .setCustomId(JSON.stringify({
                    data: {
                        action: "get-guild-config"
                    },
                    value: {}
                } as ModalCommand))
                .setTitle("Load config");

            const textBox = new TextInputBuilder()
                .setCustomId("config")
                .setLabel("Config json here")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("{roles: [], channels: []}");

            modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(textBox));

            await interaction.showModal(modal);
        }


        return;
    },
} as Command;