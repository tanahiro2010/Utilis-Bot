interface GuildRole {
    id: string;
    name: string;
    color: number;
    permissions: string;
    position: number;
    mentionable: boolean;
    hoist: boolean;
}

interface Config {
    roles: Array<GuildRole>,
    channels: Array<any>;
}

export { Config, GuildRole };