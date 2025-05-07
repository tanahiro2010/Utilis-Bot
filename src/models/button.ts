import { ButtonBuilder, ButtonStyle } from "discord.js";

function createButton(label: string, customId: string, style: ButtonStyle = ButtonStyle.Primary): ButtonBuilder {
    return new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style);
}

export { createButton };