import { ButtonInteraction, EmbedBuilder, GuildMember, Colors, MessageFlags } from "discord.js";
import { Action } from "../../interface/action";
import { ButtonCommand } from "../../interface/command";

module.exports = {
    data: {
        actionName: "auth",
        flags: MessageFlags.Ephemeral
    },

    async execute(interaction: ButtonInteraction): Promise<void> {
        console.log("Executing action: auth role");

        const { customId } = interaction;
        console.log(`Custom ID: ${customId}`);

        const command: ButtonCommand = JSON.parse(customId);
        const roleId = command.value.roleId;

        console.log(`Guild Name: ${interaction.guild?.name}`);
        console.log(`Guild ID: ${interaction.guild?.id}`);
        console.log(`User ID: ${interaction.user.id}`);
        console.log(`User Name: ${interaction.user.username}`);
        console.log(`Role ID: ${roleId}`);

        const role = interaction.guild?.roles.cache.get(roleId);
        const member: GuildMember = interaction.member as GuildMember;

        console.log(`Role Name: ${role?.name}`);

        if (!role) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription("The role does not exist anymore. Please contact the administrator.");
            
            await interaction.followUp({ embeds: [embed], ephemeral: false });
            return;
        }

        if (member.roles.cache.has(role.id)) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription("You already have this role.");
            
            await interaction.followUp({ embeds: [embed] });
            return;
        }

        try {
            await member?.roles.add(role);
        } catch (error) {
            const errorMessage = error as Error;
            console.error(error);
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription(`There was an error while adding the role. Please contact the administrator.\n${errorMessage.message}`);
            
            await interaction.followUp({ embeds: [embed] });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("Success")
            .setDescription(`You have been authenticated and given the role ${role.name}.`);

        await interaction.followUp({ embeds: [embed] });
    }
} as Action<ButtonInteraction>;