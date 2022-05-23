const { SlashCommandBuilder } = require("@discordjs/builders")
const { Client, ChatInputCommandInteraction } = require("discord.js")
const Discord = require("discord.js")
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Mira la latencia/ping del bot en milisegundos."),
    onlyDev: false,
    maintenance: false,
    memberPermissions: "None",
    botPermissions: "None",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async run(client, interaction){

        let pingbot = Math.floor(Date.now() - interaction.createdTimestamp);

        function color(ping){
            let symbol;
            if (ping < 350) {
              symbol = "+";
            } else if (ping >= 350) {
              symbol = "-";
            }

            return symbol;
        }

        const embed = new Discord.Embed()
          .setAuthor({
            name: "🏓 ¡Pong!"
          })
          .setDescription(`\`\`\`diff\n${color(pingbot)} Ping Ninja: ${pingbot}ms\n${color(client.ws.ping)} Ping API: ${client.ws.ping}ms\n${color(interaction.guild.shard.ping)} Shard: ${interaction.guild.shard.ping}ms\`\`\``)
          .setColor(0x5568f2)
          .setFooter({
            text: client.user.tag,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

       await interaction.followUp({ embeds: [embed] }) 
       
    }
}