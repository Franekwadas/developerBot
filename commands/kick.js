module.exports = {

    "name": "kick",
    "description": "Wyrzuc gracza z servera",

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

        //sprawdzanie czy został podany nick/id gracza.
        if (typeof args[0] !== 'undefined') {

            //sprawdzanie czy podany gracz istnieje
            var id = args[0].replace(/[\\<>@#&!]/g, "");

            var player = message.guild.members.cache.get(id);

            if(typeof player !== 'undefined') {

                //główny kod

                player.kick();
                message.channel.send(`Użytkownik o ${player.user.username} został wyrzucony!`);

            } else {
                //poinformowanie o tym że wprowadzony nick/id jest błędny/e.
            }

        } else {
            //powiadomienie o tym ze nie został podany nick bądź id.
            message.channel.send("Podaj id/nick gracza którego chcesz wyrzucić!");
        }

        
    }

}