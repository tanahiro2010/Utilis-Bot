import { ButtonInteraction, TextChannel, EmbedBuilder, Colors, ButtonBuilder, ActionRowBuilder, MessageFlags } from "discord.js";
import { ButtonCommand } from "../../interface/command";
import { createButton } from "../../models/button";
import { Action } from "../../interface/action";

module.exports = {
    data: {
        actionName: "delete-ticket"
    },

    async execute(interaction: ButtonInteraction): Promise<void> {
        const { customId, channel } = interaction;
        const command: ButtonCommand = JSON.parse(customId);

        if (command.value.mode == "first") {         // 確認ボタンを押していない -> 確認ボタンを送信
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Confirm")
                .setDescription("Do you want to delete this ticket?");

            const button = createButton("Delete", JSON.stringify({
                data: {
                    action: "delete-ticket",
                    flags: MessageFlags.Ephemeral
                },

                value: {
                    mode: "second"
                }
            } as ButtonCommand), );
        } else if (command.value.mode == "second") { // 確認ボタンを押下済み -> チャンネルを削除
            await channel?.delete();
        }
    }
} as Action<ButtonInteraction>;