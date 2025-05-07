import { ButtonInteraction, ButtonBuilder, ActionRowBuilder, TextChannel, EmbedBuilder, Colors, ButtonStyle } from "discord.js";
import { ButtonCommand } from "../../interface/command";
import { createButton } from "../../models/button";
import { Action } from "../../interface/action";

module.exports = {
    data: {
        actionName: "open-ticket",
        flags: 0
    },

    async execute(interaction: ButtonInteraction): Promise<void> {
        const { customId } = interaction;
        const command: ButtonCommand = JSON.parse(customId);
        const channel: TextChannel = interaction.channel as TextChannel;
        const { userId } = command.value;

        if (!channel) {
            console.error(`Channel not found -> open ticket again`);
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription("Failed to get channel info.");

            await interaction.followUp({ embeds: [embed] });

            return;
        }

        try {
            await channel.edit({
                permissionOverwrites: [
                    {
                        id: userId,
                        allow: ["ViewChannel"]
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

        try {
            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle("Open the ticket")
                .setDescription("チケットが再開されました");

            const button = createButton("Close the ticket", JSON.stringify({
                data: {
                    action: "close-ticket",
                    flags: 0
                },
                value: {
                    userId: userId
                }
            }), ButtonStyle.Danger);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

            await interaction.followUp({ embeds: [embed], components: [row] });
        } catch (error) {
            const errorMessage = error as Error;
            console.error(error);
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription(`An error occurred while creating the channel\n${errorMessage.message}`);

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        return
    }
} as Action<ButtonInteraction>