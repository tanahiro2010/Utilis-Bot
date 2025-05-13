import {
    CommandInteraction, 
    Role, 
    Guild, 
    EmbedBuilder, 
    Colors,
    GuildChannel,
    TextChannel,
    VoiceChannel,
    ForumChannel,
} from "discord.js";
import { Config, GuildRole } from "../interface/guils";
import { writeFileSync } from "fs";
import { Command } from "../interface/command";
import { scanChannels, scanRoles } from "../utils/scan";

module.exports = {
    data: {
        name: "scan",
        description: "Scan guild"
    },

    async execute(interaction: CommandInteraction) {
        const guild: Guild | null = interaction.guild;

        if (!guild) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("Error")
                .setDescription("Failed to fetch the guild info");

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        const config: Config = {
            roles: [],
            channels: []
        };

        const roles = scanRoles(guild);
        const channels = scanChannels(guild);

        roles.forEach((role) => { config.roles.push(role) });
        channels.forEach((channel) => { config.channels.push(channel) });


        writeFileSync(`./sample.json`, JSON.stringify(config), { encoding: "utf-8" });

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle("Success")
            .setDescription("Please download the json file");

        await interaction.followUp({ embeds: [embed], files: ['./sample.json']});


        return;
    },
} as Command;