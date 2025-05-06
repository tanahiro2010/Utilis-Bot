import { ButtonInteraction, ButtonBuilder, ActionRowBuilder } from "discord.js";
import { Action } from "../interface/action";

module.exports = {
    data: {
        actionName: "close-ticket"
    },

    async execute(interaction: ButtonInteraction): Promise<void> {
        const { customId, member } = interaction;

        const command = JSON.parse(customId);
        // const {  }
    }
} as Action<ButtonInteraction>;