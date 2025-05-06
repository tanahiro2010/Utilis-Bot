import { CommandInteraction, MessageFlags } from "discord.js";
import { Command } from "../interface/command";

module.exports = {
    data: {
        name: "ping",
        flags: MessageFlags.Ephemeral,
        description: "Ping command"
    },
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.followUp(`WebSocket Ping: ${interaction.client.ws.ping}ms`);
        return;
    }
} as Command;