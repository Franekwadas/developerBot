module.exports = {

  "name": "resetconfig",
  "description": "Możesz zrestartować tą komendą konfigurację bota na twój server!",

  execute(message, args, client) {

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