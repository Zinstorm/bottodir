"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, Guild } = require("discord.js");

// Database query
const User = require("../../../models/Admin/userblacklist");

// Configis
const emojis = require("../../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

module.exports.ownerOnly = {
    ownerOnly: true
};
  
/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {
        const user = interaction.options.getString("id");

        const isBlacklisted = await User.findOne({ userID: user })
        if(isBlacklisted) return interaction.reply({ content: `${emojis.error} | <@${user}> is already blacklisted.`, ephemeral: true })

        const blacklist = new User({
            userID: user,
            active: true
        })
        blacklist.save();

        const embed = new MessageEmbed()
        .setTitle(`${emojis.notify} Profile Updated`)
        .setDescription(`Dear ${user.tag}, your profile got updated!\n\n**Action:** Blacklisted.\nYou have been banned from using my Commands.\n\nIf you think this was a mistake, contact \`Koni#9521\`.`)
        .setColor("RED")
        .setTimestamp()

        interaction.reply({ content: `${emojis.success} | Successfully blacklisted ${user}`, ephemeral: true })
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
    userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
    .setName("blacklistuser")
    .setDescription("Blacklist a User from using the Bot")
    .addStringOption((option) => option.setName("id").setDescription("Who should get blacklisted?").setRequired(true));
