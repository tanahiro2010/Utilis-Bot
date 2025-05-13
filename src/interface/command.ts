import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';

interface Command {
  data: {
    name: string;
    description: string;
    flags: number;
    defer: boolean;
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
    defer?: boolean;
  };

  value: Record<string, any>;
}

interface ModalCommand {
  data: {
    action: string;
    flags?: number;
    defer?: boolean;
  };

  value: Record<string, any>;
}

export type { Command, ButtonCommand, ModalCommand };