import { Client, GatewayIntentBits, Interaction, CacheType, ButtonInteraction, MessageFlags, MessageFlagsBitField } from "discord.js";
import { Action } from "./interface/action";
import { Command } from "./interface/command";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const fileType: string = ".ts";

const client = new Client({
    intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
});

// Registering commands
const commands: { [key: string]: Command } = {};
const commandFiles = fs.readdirSync("./src/commands").filter((file) => file.endsWith(fileType));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`) as Command;
    commands[command.data.name] = command;
}

const actions: { button: { [key: string]: Action<ButtonInteraction> } } = { button: {} };
const actionFiles = fs.readdirSync("./src/actions").filter((file) => file.endsWith(fileType));
for (const file of actionFiles) {
    const action = require(`./actions/${file}`) as Action<ButtonInteraction>;
    actions.button[action.data.actionName] = action;
}

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    console.log("Registering commands...");

    const data = [];

    for (const commandName in commands) {
        console.log(`Registering command: ${commandName}`);
        data.push(commands[commandName].data);
    }

    await client.application?.commands.set(data as any);

    console.log("Commands registered successfully!");
    return client.user?.setActivity("with Discord.js", { type: 0 });
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => { // コマンドの実行
    if (!interaction.isCommand()) return;
    

    const { commandName } = interaction;
    const command: Command = commands[commandName];
    const flags = command.data.flags || 0;

    await interaction.deferReply({ flags });

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
    
    const { customId } = interaction;
    const command = JSON.parse(customId);
    const { data } = command;
    const actionName = data.action;
    const flags: number = data.flags || 0;

    await interaction.deferReply({ flags });

    const action: Action<ButtonInteraction> = actions.button[actionName];
    if (!action) {
        console.error(`Action ${actionName} not found`);
        await interaction.followUp("This action does not exist!");
        return;
    }

    console.log(`Executing action: ${actionName}`);
    await action.execute(interaction);
});

export { fileType };
client.login(process.env.DISCORD_TOKEN);