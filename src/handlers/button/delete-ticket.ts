import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ModalCommand } from "../../interface/command";
import { createButton } from "../../models/button";
import { readFileSync } from "fs";
import { randomInt } from "crypto";
import { Question } from "../../interface/question";
import { Action } from "../../interface/action";

module.exports = {
    data: {
        actionName: "delete-ticket"
    },

    async execute(interaction: ButtonInteraction): Promise<void> {
        const { customId, channel } = interaction;
        const questions: Array<Question> = JSON.parse(readFileSync("src/data/questions.json", { encoding: "utf-8" }));
        const question = questions[randomInt(questions.length - 1)];
        console.log(question);

        const modal = new ModalBuilder()
            .setTitle("Confirm")
            .setCustomId(JSON.stringify({
                data: {
                    action: "delete-ticket",
                    flags: 0
                },

                value: {
                    channel: channel?.id
                }
            } as ModalCommand));

        const textInput = new TextInputBuilder()
            .setStyle(TextInputStyle.Short)
            .setLabel(`問題: ${question.question}`)
            .setCustomId(JSON.stringify({
                data: {
                    action: "auth-question"
                },

                value: {
                    answer: question.answer
                }
            } as ModalCommand));

        const raw = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);
        modal.addComponents(raw);

        await interaction.showModal(modal);

        return;
    }
} as Action<ButtonInteraction>;