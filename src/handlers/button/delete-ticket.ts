import { ButtonInteraction, TextChannel, EmbedBuilder, Colors } from "discord.js";
import { ButtonCommand } from "../../interface/command";
import { Action } from "../../interface/action";

module.exports = {
    data: {
        actionName: "delete-ticket"
    },

    async execute(interaction: ButtonInteraction): Promise<void> {
        const { customId, channel } = interaction;
        
    }
} as Action<ButtonInteraction>;