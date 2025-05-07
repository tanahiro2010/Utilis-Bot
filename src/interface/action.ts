import { ButtonInteraction, ModalSubmitInteraction } from "discord.js";

interface Action<ActionType = ButtonInteraction | ModalSubmitInteraction | any> {
    data: {
        actionName: string;
    };

    execute: (interaction: ActionType) => Promise<void>;
}

export { Action };