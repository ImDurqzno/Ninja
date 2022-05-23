async function stats(client) {
  const promises = [
    client.shard.fetchClientValues("guilds.cache.size"),
    client.shard.broadcastEval((c) =>
      c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
    ),
  ];

  const results = await Promise.all(promises)
  
      const totalGuilds = results[0].reduce(
        (acc, guildCount) => acc + guildCount,
        0
      );
      const totalMembers = results[1].reduce(
        (acc, memberCount) => acc + memberCount,
        0
      );
      const obj = {
          guildCount: totalGuilds,
          userCount: totalMembers
      }
      return obj;

}

module.exports = stats;