import { ButtonInteraction, ButtonBuilder, ActionRowBuilder, TextChannel, EmbedBuilder, Colors, ButtonStyle } from "discord.js";
import { Action } from "../interface/action";
import { createButton } from "../models/button";

module.exports = {
    data: {
        actionName: "close-ticket"
    },

    async execute(interaction: ButtonInteraction): Promise<void> {
        const { customId } = interaction;
        const channel: TextChannel = interaction.channel as TextChannel;

        if (!channel) {
            console.error(`Channel not found -> close ticket`);
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription("Failed to get channel info.");

            await interaction.followUp({ embeds: [embed] });

            return;
        }

        const command = JSON.parse(customId);
        console.log(command);
        const { userId } = command.value;

        try {
            await channel.edit({
                permissionOverwrites: [
                    {
                        id: userId,
                        deny: ["ViewChannel"]
                    }
                ]
            });
        } catch (error) {
            const errorMessage: Error = error as Error;

            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription(`Edit permission error\n${errorMessage.message}`);

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.Aqua)
            .setTitle("Close the ticket")
            .setDescription("The ticket closed.\nIf you want to open, Please click to the below button.");

        const openButton = createButton("Open again", JSON.stringify({
            data: {
                action: "open-ticket",
                flags: 0
            },

            value: {
                userId: userId,
            }
        }), ButtonStyle.Premium);

        const deleteButton = createButton("Delete ticket", JSON.stringify({
            data: {
                action: "delete-ticket",
                flags: 0
            },

            value: {}
        }), ButtonStyle.Danger);

        const raw = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(openButton)
            .addComponents(deleteButton);

        await interaction.followUp({ embeds: [embed], components: [raw] });

        return;
    }
} as Action<ButtonInteraction>;