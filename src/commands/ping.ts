import { CommandInteraction } from "discord.js";
import { Command } from "../interface/command";

module.exports = {
    data: {
        name: "ping",
        description: "Ping command"
    },
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.followUp(`WebSocket Ping: ${interaction.client.ws.ping}ms`);
        return;
    }
} as Command;