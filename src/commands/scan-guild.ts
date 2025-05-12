import { CommandInteraction } from "discord.js";
import { Command } from "../interface/command";


module.exports = {
    data: {
        name: "scan",
        description: "Scan guild"
    },

    async execute(interaction: CommandInteraction) {
        return
    },
} as Command;