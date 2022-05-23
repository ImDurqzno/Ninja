const Discord = require("discord.js");
const { GatewayIntentBits, Partials } = require("discord.js");
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
  ],
});

require('dotenv').config()
const config = require('./config.json')

require("./handlers/slashcommands")

const fs = require("fs")

client.slashcommands = new Discord.Collection();
const slashcommandsFiles = fs.readdirSync("./slashCommands").filter(file => file.endsWith("js"))

for(const file of slashcommandsFiles){
  const slash = require(`./slashCommands/${file}`)
  client.slashcommands.set(slash.data.name, slash)
}

client.on("ready", async () => {
  console.log(`Bot Listo, como ${client.user.tag}`);

  const estadisticas = require("./helpers/NinjaStats");  

  setInterval(async function(){
    const stats = await estadisticas(client);

    let estados = [
      {
        name: `${stats.guildCount} Servidores`,
        type: "COMPETING",
      },
      {
        name: `${stats.userCount} Usuarios`,
        type: "WATCHING",
      },
      {
        name: "NinjaBot | n/help", 
        type: "PLAYING",
      },
      {
        name: "ninja-bot.xyz", 
        type: "PLAYING",
      },
    ];

    let randomStatus = estados[Math.floor(Math.random() * estados.length)];

    await client.user.setPresence({
      status: "online",
      activities: [randomStatus]
    });
  }, 120000);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const slashcmds = client.slashcommands.get(interaction.commandName);

    if (!slashcmds) return;

    if (slashcmds.memberPermissions !== "None") {
      if (!interaction.member.permissions.has(slashcmds.memberPermissions)) {
        const embedPermisssions = new Discord.Embed() 
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${config.EMOJI_NO} ¡Hey! Te hace falta el permiso \`${slashcmds.memberPermissions.toUpperCase().slice(0, 1)}${slashcmds.memberPermissions.toLowerCase().slice(1, slashcmds.memberPermissions.length).replace("_", "").replace("_", "").replace("_", "")}\``)
        .setColor(0x2F3136)

        return await interaction.reply({ embeds: [embedPermisssions] })
      }
    }

    if (slashcmds.botPermissions !== "None") {
      if (!interaction.guild.me.permissions.has(slashcmds.botPermissions)) {
        const embedPermisssions = new Discord.Embed() 
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setDescription(`${config.EMOJI_NO} ¡Hey! Me falta el permiso \`${slashcmds.botPermissions.toUpperCase().slice(0, 1)}${slashcmds.botPermissions.toLowerCase().slice(1, slashcmds.botPermissions.length).replace("_", "").replace("_", "").replace("_", "")}\``)
        .setColor(0x2F3136)

        return await interaction.reply({ embeds: [embedPermisssions] })
      }
    }

    let devIds = ["910543706489237544", "912759623914762271", "735295378563399711"]

    if(slashcmds.onlyDev === true){      
      if(!devIds.some(id => id === interaction.user.id)){
        const embedOnlyDev = new Discord.Embed() 
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setDescription(`${config.EMOJI_NO} ¡Hey! Este comando está únicamente habilitado para mis desarrolladores.`)
        .setColor(0x2F3136)

        return await interaction.reply({ embeds: [embedOnlyDev] })
      }
    }

    if(slashcmds.maintenance === true){
      if(!devIds.some(id => id === interaction.user.id)){
        const embedMantenimiento = new Discord.Embed() 
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setDescription(`${config.EMOJI_NO} Lo siento, este comando está en mantenimiento.`)
        .setColor(0x2F3136)

        return await interaction.reply({ embeds: [embedMantenimiento] })
      }
    }

    try {

      await interaction.deferReply();

      setTimeout(async function () {
        await slashcmds.run(client, interaction).catch(async e => {          
          const embedError = new Discord.Embed()
          .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL()})
          .setDescription(`${config.EMOJI_NO} Oops...¡Ha ocurrido un error!`)
          .setColor(0x2F3136)
          .setFooter({ text: "Lo siento mucho por los inconvenientes. Pronto esto se resolverá." })

          console.error(`Se ha producido un error.\nUsuario: ${interaction.user.tag}\nServidor: ${interaction.guild.name}\nComando: ${interaction.commandName}\n\n${e}`);
          await interaction.followUp({ embeds: [embedError] })
        })
      }, 2000);

    } catch (e) {

      console.error(e)      

    }
  }
}); 

client.login(process.env.TOKEN)