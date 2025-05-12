import { Client, GatewayIntentBits, Interaction, CacheType, ButtonInteraction, ModalSubmitInteraction, Message, PartialMessage, TextChannel, EmbedBuilder, Colors } from "discord.js";
import { ButtonCommand, Command, ModalCommand } from "./interface/command";
import { WriteCream } from "./libs/writecream";
import { Action } from "./interface/action";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const fileType: string = `.${process.argv[2] ?? "ts"}`;
console.log("FileType: ", fileType);

const client = new Client({
    intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
});

// self interface
interface Actions {
    button: Record<string, Action<ButtonInteraction>>;
    modal: Record<string, Action<ModalSubmitInteraction>>;

    [key: string]: {
        [key: string]: Action<any>
    }
}

// Registering commands
console.log("Fetching command...");
const commands: { [key: string]: Command } = {};
const commandFiles = fs.readdirSync("./src/commands").filter((file) => file.endsWith(fileType));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`) as Command;
    console.warn(`  Load: ${command.data.name}`);
    commands[command.data.name] = command;
}
console.log("End load command");
console.log("");

console.log("Fetching handlers...");
const actions: Actions = { button: {}, modal: {} };
const folders = fs.readdirSync("./src/handlers");
for (const folder of folders) {
    const actionFiles = fs.readdirSync(`./src/handlers/${folder}`).filter((file) => file.endsWith(fileType));
    console.log(`  Handler Type: ${folder}`);

    for (const file of actionFiles) {
        const path = `./handlers/${folder}/${file}`;
        const action = require(path) as Action<any>;
        console.warn(`    Load: ${action.data.actionName}`);

        actions[folder][action.data.actionName] = action;
    }

    console.log(`  End load ${folder} handlers`);
    console.log("")
}
console.log("End load handlers");
console.log("");

const writecream: WriteCream = new WriteCream();


client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    console.log("Registering commands...");

    const data = [];

    for (const commandName in commands) {
        console.warn(`  Registering command: ${commandName}`);
        data.push(commands[commandName].data);
    }

    await client.application?.commands.set(data as any);

    console.log("Commands registered successfully!");
    console.log("");

    return client.user?.setActivity("with Discord.js", { type: 0 });
});

client.on("messageCreate", async (message: Message) => {
    const { content, channel } = message;

    if (!channel.isTextBased()) return;
    if (!content.includes("<@1368873633904070735>")) return;
    console.log("Message: ", content);

    const result: null | string = await writecream.askGemini(content.replace("<@1368873633904070735>", ""));
    if (!result) {
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle("Error")
            .setDescription("Response error");

        await message.reply({ embeds: [embed] });
        return
    }

    await message.reply(result);
    return;
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => { // コマンドの実行
    if (!interaction.isCommand()) return;
    

    const { commandName } = interaction;
    const command: Command = commands[commandName];
    const flags = command.data.flags || 0;
    console.log(`Flags: ${flags}`);

    await interaction.deferReply({ flags });

    if (!command) {
        console.error(`Command ${commandName} not found`);
        await interaction.followUp("This command does not exist!");
        return;
    }

    console.log(`Executing command: ${commandName}`);
    console.log("");

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
    const command: ButtonCommand = JSON.parse(customId);
    const { data } = command;
    const actionName = data.action;
    const flags: number = data.flags || 0;
    console.log(`Flags: ${flags}`);
    console.log(data.action);

    if (data.defer !== false) {
        await interaction.deferReply({ flags });
    }
    

    const action: Action<ButtonInteraction> = actions.button[actionName];
    if (!action) {
        console.error(`Action ${actionName} not found`);
        await interaction.followUp("This action does not exist!");
        return;
    }

    console.log(`Executing action: ${actionName}`);
    console.log("");
    await action.execute(interaction);
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => { // ダイアログの実行
    if (!interaction.isModalSubmit()) return;

    const { customId } = interaction;
    const command: ModalCommand = JSON.parse(customId);
    const { data } = command;
    const actionName = data.action;
    const flags: number = data.flags || 0;

    if (data.defer !== false) {
        await interaction.deferReply({ flags });
    }
    

    const action: Action<ModalSubmitInteraction> = actions.modal[actionName];
    if (!action) {
        console.error(`Action ${actionName} not found`);
        await interaction.followUp("This action does not exist!");
        return;
    }

    console.log(`Executing action: ${actionName}`);
    console.log("");
    await action.execute(interaction);
});

export { fileType };
client.login(process.env.DISCORD_TOKEN);