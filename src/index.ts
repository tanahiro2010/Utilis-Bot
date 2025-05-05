import { Client, GatewayIntentBits, Interaction, CacheType, ButtonInteraction } from "discord.js";
import { Command } from "./interface/command";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const client = new Client({
    intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
});

// Registering commands
const commands: { [key: string]: Command } = {};
const commandFiles = fs.readdirSync("./src/commands").filter((file) => file.endsWith(".ts"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`) as Command;
    commands[command.data.name] = command;
}

const actions: { [key: string]: (interaction: ButtonInteraction, data: { [key: string]: any }) => void } = {};
const actionFiles = fs.readdirSync("./src/actions").filter((file) => file.endsWith(".ts"));
for (const file of actionFiles) {
    const action = require(`./actions/${file}`) as (interaction: ButtonInteraction, data: { [key: string]: any }) => void;
    Object.keys(action).forEach((key) => {
        actions[file.replace('.ts', '')] = action;
    });
}

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);

    return client.user?.setActivity("with Discord.js", { type: 0 });
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => { // コマンドの実行
    if (!interaction.isCommand()) return;

    await interaction.deferReply();

    const { commandName } = interaction;
    const command: Command = commands[commandName];

    if (!command) {
        console.error(`Command ${commandName} not found`);
        await interaction.followUp("This command does not exist!");
        return;
    }

    console.log(`Executing command: ${commandName}`);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
        } else {
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => { // ボタンの実行
    if (!interaction.isButton()) return;

    await interaction.deferReply();
    
    const { customId } = interaction;
    const data = JSON.parse(customId);
});

client.login(process.env.DISCORD_TOKEN);