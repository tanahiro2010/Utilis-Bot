import { ButtonInteraction, EmbedBuilder, GuildMember, Colors, MessageFlags } from "discord.js";
import { Action } from "../interface/action";

module.exports = {
    data: {
        actionName: "ticket",
    },

    async execute(interaction: ButtonInteraction): Promise<void> {
        
    }
} as Action<ButtonInteraction>;