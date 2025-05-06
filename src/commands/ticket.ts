import { 
    ApplicationCommandOptionType, 
    CommandInteraction, 
    EmbedBuilder, 
    ButtonStyle,
    ActionRowBuilder, 
    ButtonBuilder, 
    Colors, 
    MessageFlags, 
    ChannelType,
    CategoryChannel,
    Role
} from "discord.js";
import { createButton } from "../models/button";
import { Command } from "../interface/command";

module.exports = {
    data: {
        name: "ticket",
        description: "Create a ticket board",
        flags: 0,
        options: [
            {
                name: "category-name",
                description: "Category for the ticket's name",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "role",
                description: "Can see and manage the ticket board",
                type: ApplicationCommandOptionType.Role,
                required: true
            },
            {
                name: "title",
                description: "Title of the ticket board. default: Ticket Board",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "description",
                description: "Description of the ticket board. default: Click the button below to create a ticket.",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "button-text",
                description: "Text of the button. default: Create Ticket",
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
        const title = interaction.options.get("title")?.value as string || "Ticket Board";
        const description = interaction.options.get("description")?.value as string || "Click the button below to create a ticket.";
        const role = interaction.options.get("role")?.role as Role;
        const categoryName = interaction.options.get("category-name")?.value as string;
        const buttonText = interaction.options.get("button-text")?.value as string || "Create Ticket";
        const buttonStyle = interaction.options.get("button-style")?.value as ButtonStyle || ButtonStyle.Primary;
        let category;

        try {
            category = await interaction.guild?.channels.create({
                name: categoryName,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guild?.id,
                        deny: ["ViewChannel"]
                    },
                    {
                        id: role.id,
                        allow: ["ViewChannel"]
                    }
                ],
            });
        } catch (error) {
            console.error(error);
            const errorMessage = error as Error;
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription(`An error occurred while creating the category\n${errorMessage.message}`);
            await interaction.followUp({
                embeds: [embed]
            });

            return;
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(title)
            .setDescription(description);

        const button = createButton(
            buttonText,
            JSON.stringify({
                data: {
                    action: "ticket",
                    flags: 0
                },
                value: {
                    categoryId: category?.id
                }
            }),
            buttonStyle
        );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await interaction.followUp({ embeds: [embed], components: [row] });
    }
} as Command;