import { Guild, GuildChannel, PermissionsBitField, PermissionOverwriteOptions } from "discord.js";

async function restoreRoles(guild: Guild, rolesData: any[]) {

  for (const [, role] of guild.roles.cache) {
    try {
      await role.delete("サーバー構成の初期化");
      console.log(`Deleted role: ${role.name}`);
    } catch (error) {
      console.error(`Failed to delete role ${role.name}:`, error);
    }
  }

  // @everyone を除いて並び順でソート（position昇順）
  const rolesToCreate = rolesData
    .filter(role => role.name !== "@everyone")
    .sort((a, b) => b.position - a.position);

  const roles: Record<string, string> = {};

  for (const data of rolesToCreate) {
    const role = await guild.roles.create({
      name: data.name,
      color: data.color,
      hoist: data.hoist,
      mentionable: data.mentionable,
      permissions: new PermissionsBitField(BigInt(data.permissions)),
      reason: "Role restored from template"
    });

    roles[data.id] = role.id;
  }

  return roles;
}

async function restoreChannels(guild: Guild, channelsData: any[], roles: Record<string, string>) {
  const createdChannels: Record<string, any> = {};

  for (const [, channel] of guild.channels.cache) {
    try {
      await channel.delete("サーバー構成の初期化");
      console.log(`Deleted channel: ${channel.name}`);
    } catch (error) {
      console.error(`Failed to delete channel ${channel.name}:`, error);
    }
  }

  // 親カテゴリ→子チャンネルの順に並び替え
  const sortedChannels = channelsData.sort((a, b) => a.position - b.position);

  for (const data of sortedChannels) {
    const channel: GuildChannel = await guild.channels.create({
      name: data.name,
      type: data.type,
      parent: data.parentId ? createdChannels[data.parentId]?.id : undefined,
      topic: data.topic ?? undefined,
      nsfw: data.nsfw ?? false,
      rateLimitPerUser: data.rateLimitPerUser ?? 0,
      userLimit: data.userLimit ?? undefined,
      bitrate: data.bitrate ?? undefined,
      position: data.position
    });

    // 保存しておいて子チャンネルの parent に使えるようにする
    createdChannels[data.id] = channel;

    // permissionOverwrites の適用
    if (data.permissionOverwrites) {
      for (const perm of data.permissionOverwrites) {
        if (perm.type) {
          const role = guild.roles.cache.get(perm.id);

          if (role) {
            try {
              await channel.permissionOverwrites.create(role, {
                allow: BigInt(perm.allow),
                deny: BigInt(perm.deny)
              } as PermissionOverwriteOptions);
            } catch (e) {
              console.error(e);
            }
          }

        }
      }
    }
  }

}

export { restoreChannels, restoreRoles };