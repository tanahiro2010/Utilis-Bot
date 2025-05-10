import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';

interface Command {
  data: {
    name: string;
    description: string;
    flags: number;
    options?: Array<{
      name: string;
      description: string;
      type:
        | ApplicationCommandOptionType.Subcommand
        | ApplicationCommandOptionType.SubcommandGroup
        | ApplicationCommandOptionType.String
        | ApplicationCommandOptionType.Integer
        | ApplicationCommandOptionType.Boolean
        | ApplicationCommandOptionType.User
        | ApplicationCommandOptionType.Channel
        | ApplicationCommandOptionType.Role
        | ApplicationCommandOptionType.Mentionable
        | ApplicationCommandOptionType.Number
        | ApplicationCommandOptionType.Attachment;
      required?: boolean;
      choices?: Array<{
        name: string;
        value: string | number;
      }>;
    }>;
  };

  execute: (interaction: CommandInteraction) => Promise<void>;
}

interface ButtonCommand {
  data: {
    action: string;
    flags: number;
  };

  value: Record<string, any>;
}

export type { Command, ButtonCommand };