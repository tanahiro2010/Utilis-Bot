import { ButtonInteraction, EmbedBuilder, GuildMember, Colors, ButtonStyle, ActionRowBuilder, TextChannel, ButtonBuilder, MessageFlags } from "discord.js";
import { ButtonCommand } from "../../interface/command";
import { createButton } from "../../models/button";
import { Action } from "../../interface/action";


module.exports = {
    data: {
        actionName: "create-ticket",
        flags: MessageFlags.Ephemeral
    },

    async execute(interaction: ButtonInteraction): Promise<void> {
        const { customId, member } = interaction;
        const guildMember = member as GuildMember;
        const command: ButtonCommand = JSON.parse(customId);
        const { categoryId } = command.value;

        const category = interaction.guild?.channels.cache.get(categoryId);
        if (!category) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription("The category does not exist anymore. Please contact the administrator.");

            await interaction.followUp({ embeds: [embed], ephemeral: false });

            return;
        }

        try {
            const channel: TextChannel = await interaction.guild?.channels.create({
                name: `${guildMember.user.username}-ticket`,
                type: 0, // Text channel
                parent: categoryId,
                permissionOverwrites: [
                    {
                        id: interaction.guild?.id,
                        deny: ["ViewChannel"]
                    },
                    {
                        id: guildMember.id,
                        allow: ["ViewChannel"]
                    }
                ]
            }) as TextChannel;

            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle("Ticket")
                .setDescription(`Ticket created successfully!\nWhen close the ticket, please click the button below.\n@everyone`);

            const button = createButton("Close the ticket", JSON.stringify({ 
                data: { 
                    action: "close-ticket", 
                    flags: 0 
                }, 
                value: {
                    userId: guildMember.id
                } 
            }), ButtonStyle.Danger);
            
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

            await channel.send({ content: "@everyone", embeds: [embed], components: [row], allowedMentions: { parse: ["everyone"] } });
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

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle("Ticket")
            .setDescription(`Ticket created successfully!`);

        await interaction.followUp({ embeds: [embed] });

        return;
    }
} as Action<ButtonInteraction>;