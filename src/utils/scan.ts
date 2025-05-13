import { Guild, Role, TextChannel, ForumChannel, VoiceChannel, GuildChannel } from "discord.js";
import { GuildRole } from "../interface/guils";

function scanChannels(guild: Guild): Array<Record<string, any>> {
    const channels: Array<Record<string, any>> = new Array<Record<string, any>>();

    guild.channels.cache.forEach(channel => {
        // rawPosition や permissionOverwrites があるのは GuildChannel
        if (!("rawPosition" in channel)) return;

        const ch = channel as GuildChannel;

            channels.push({
                id: ch.id,
                name: ch.name,
                type: ch.type,
                parentId: ch.parentId,
                position: ch.rawPosition,
                topic: "topic" in ch ? (ch as TextChannel).topic : undefined,
                nsfw: "nsfw" in ch ? (ch as TextChannel | ForumChannel).nsfw : undefined,
                rateLimitPerUser: "rateLimitPerUser" in ch ? (ch as TextChannel).rateLimitPerUser : undefined,
                userLimit: "userLimit" in ch ? (ch as VoiceChannel).userLimit : undefined,
                bitrate: "bitrate" in ch ? (ch as VoiceChannel).bitrate : undefined,
                permissionOverwrites: ch.permissionOverwrites.cache.map((overwrite) => {
                    const isRole = guild.roles.cache.has(overwrite.id);

                    return {
                        id: overwrite.id,
                        type: isRole,
                        allow: overwrite.allow.bitfield.toString(),
                        deny: overwrite.deny.bitfield.toString()
                    }
                })
            });
    });

    return channels;
}

function scanRoles(guild: Guild): Array<GuildRole> {
    const roles: Array<GuildRole> = new Array<GuildRole>();

    guild?.roles.cache.forEach((role: Role) => {
        const roleConf: GuildRole = {
            id: role.id,
            name: role.name,
            color: role.color,
            permissions: role.permissions.bitfield.toString(),
            position: role.position,
            mentionable: role.mentionable,
            hoist: role.hoist
        }
        roles.push(roleConf);
    });

    return roles;
}

export { scanChannels, scanRoles };