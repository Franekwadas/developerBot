module.exports = {

  "name": "resetconfig",
  "description": "Możesz zrestartować tą komendą konfigurację bota na twój server!",

  execute(message, args, client) {

    var config = client.configFile.find(c => c.guildId == message.guild.id);

    if (config.moderatorRoles.length <= 0) {
        message.channel.send("Błąd konfiguracji! Nikt nie skonfigurował roli moderatorskich.");
        return;
    }

    var hasPermission = false;

    config.moderatorRoles.forEach(role => {
        if (message.member.roles.cache.has(role)) {
            hasPermission = true;
        }
    });

    if (!hasPermission) {
        message.channel.send("Nie masz wystarczających uprawnień!");
        return;
    }


    if (!message.member.permissions.has('MANAGE_GUILD')) return;
    try {
      client.configFile.splice(client.configFile.indexOf(client.config), 1);

      message.channel.send("Pomyślnie zrestartowano config");
    } catch (error) {
      console.error(error)
      message.channel.send("Wystąpił błąd podczas resetowania configu!");
    }
    

  }

}