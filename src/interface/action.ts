import { ButtonInteraction } from "discord.js";

interface Action<ActionType = ButtonInteraction | any> {
    data: {
        actionName: string;
    };

    execute: (interaction: ActionType) => Promise<void>;
}

export { Action };