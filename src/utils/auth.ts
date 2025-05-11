import { GuildMember, PermissionsBitField, Role } from "discord.js";

/**
 * ユーザーのロールをすべて確認し、合成された最大権限を返す
 * @param user GuildMember
 * @returns PermissionsBitField（合成された全パーミッション）
 */
function getMaxPermissions(member: GuildMember): PermissionsBitField {
    let combined = new PermissionsBitField();

    member.roles.cache.forEach((role: Role) => {
        combined = combined.add(role.permissions);
    });

    return combined;
}

export { getMaxPermissions };