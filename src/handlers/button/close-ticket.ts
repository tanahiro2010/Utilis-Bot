import { ButtonInteraction, ButtonBuilder, ActionRowBuilder, TextChannel, EmbedBuilder, Colors, ButtonStyle } from "discord.js";
import { ButtonCommand } from "../../interface/command";
import { createButton } from "../../models/button";
import { Action } from "../../interface/action";

module.exports = {
    data: {
        actionName: "close-ticket",
        flags: 0
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

        const command: ButtonCommand = JSON.parse(customId);
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

        await interaction.followUp({});

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
        }));

        const deleteButton = createButton("Delete ticket", JSON.stringify({
            data: {
                action: "delete-ticket",
                flags: 0
            },

            value: {
                mode: "first"
            }
        }), ButtonStyle.Danger);

        const raw = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(openButton)
            .addComponents(deleteButton);

        await channel.send({ embeds: [embed], components: [raw] });

        return;
    }
} as Action<ButtonInteraction>;