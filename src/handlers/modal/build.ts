import { Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { ModalCommand } from "../../interface/command";
import { Action } from "../../interface/action";

module.exports = {
    data: {
        actionName: "get-guild-config",
    },

    async execute(interaction: ModalSubmitInteraction) {
        return;
    }
} as Action<ModalSubmitInteraction>;