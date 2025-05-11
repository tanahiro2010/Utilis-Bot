import { Colors, EmbedBuilder, ModalSubmitInteraction, TextChannel } from "discord.js";
import { ModalCommand } from "../../interface/command";
import { Question } from "../../interface/question";
import { Action } from "../../interface/action";

module.exports = {
    data: {
        actionName: "delete-ticket",
        defer: false
    },

    async execute(interaction: ModalSubmitInteraction) {
        const { channel } = interaction;

        const inputRawId = interaction.fields.fields.first()?.customId;

        if (!inputRawId) {
            console.error(`Input raw id not found`);
            return;
        }

        const question: ModalCommand = JSON.parse(inputRawId);
        const answer = question.value.answer;
        const userAnswer = interaction.fields.getTextInputValue(inputRawId);
        console.log(question);
        console.log(userAnswer);

        if (answer === userAnswer) {
            try {
                await channel?.delete();
            } catch (e) { 
                console.error(e);
                const errorMessage = e as Error;
                const embed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle("Failed to delete channel")
                    .setDescription(errorMessage.message);

                await interaction.followUp({ embeds: [embed] });
                return;
            }
        } else {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Failed to confirm")
                .setDescription("Your answer is invalid.");

            await interaction.followUp({ embeds: [embed] });
            return;
        }
    }
} as Action<ModalSubmitInteraction>;