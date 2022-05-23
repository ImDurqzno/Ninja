const { SlashCommandBuilder } = require("@discordjs/builders")
const { Client, ChatInputCommandInteraction } = require("discord.js")
const Discord = require("discord.js")
const config = require('../config.json')
const { inspect } = require("util");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("[Privado] Evalúa un código en el bot.")
    .addStringOption(option => option.setName("código").setDescription("El código que evaluarás.").setRequired(true)),
    onlyDev: true,
    maintenance: false,
    memberPermissions: "None",
    botPermissions: "None",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async run(client, interaction){
        
        const command = interaction.options.getString("código")

        try {
          const evalet = eval(command);

          let palabras = ["token", "destroy"];

          if (palabras.some((word) => command.toLowerCase().includes(word))) {
            return interaction.followUp("Esas palabras están prohibidas.");
          }
          const embed = new Discord.Embed()
            .setColor(0x2f3136)
            .setTitle("`✅` Evaluado Correctamente.")
            .addField({ name: `**Tipo**:`, value: `\`\`\`prolog\n${typeof evalet}\`\`\``, inline: true })
            .addField({ name: `**Evaluado en:**`, value: `\`\`\`yaml\n${Date.now() - interaction.createdTimestamp}ms\`\`\``, inline: true })
            .addField({ name: `**Entrada:**`, value: `\`\`\`js\n${command}\`\`\`` })
            .addField({ name: `**Salida:**`, value: `\`\`\`js\n${inspect(evalet, { depth: 0 })}\`\`\`` })
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

          await interaction.followUp({ embeds: [embed] });
        } catch (error) {
          const embedError = new Discord.Embed()
            .setColor(0x2f3136)
            .setTitle("`❌` No evaluado correctamente.")
            .addField({ name: `**Entrada:**`, value: `\`\`\`js\n${command}\`\`\`` })
            .addField({ name: `**Error:**`, value: `\`\`\`${error}\`\`\`` })
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

          await interaction.followUp({ embeds: [embedError] });
        }
       
    }
}