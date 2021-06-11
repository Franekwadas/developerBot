const Discord = require('discord.js')

module.exports = {

    "name": "accdec",
    "description": "AcceptDecline - przyjmij lub odrzuc podanie",

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

        var acctualRekruFile = client.acctualRekru.find(g => g.guildId == message.guild.id);

        if (typeof args[0] !== 'undefined') {

            var id = args[0].replace(/[\\<>@#&!]/g, "");

            var player = message.guild.members.cache.get(id);

            if(typeof player !== 'undefined') {

                var rekrutationOfThisGuildMember = acctualRekruFile.waitingForCheck.find(g => g.userId == id);

                if (typeof rekrutationOfThisGuildMember === 'undefined') {
                    message.channel.send("Gracz o takim ID nie przechodzi rekrutacji lub nie wysłał jeszcze podania!");
                    return;
                }

                if (typeof args[1] !== 'undefined') {

                        var anySwtichWasUsed = false;

                        switch (args[1]) {
                            case "zatwierdzam":
                            case "przyjmuję":
                            case "przyjmuje":
                            case "przyjmij":
                            case "zatwierdz":
                                var thisRekrutation = acctualRekruFile.waitingForCheck.find(r => r.userId == id);
                                thisRekrutation.showAtWnioski = false;
                                player.roles.add(config.normalGuildMemberRole);
                                player.roles.remove(config.rekrutationRole);
                                player.send("**Gratulacje! Zostałeś przyjęty do zespołu**");
                                message.channel.send(`Rekrutacja użytkownika ${player.user.username} została rozpatrzona pomyślnie!`);
                                client.reloadConfig()
                                anySwtichWasUsed = true;
                                break;
                            case "odrzucam":
                            case "odrzuc":
                                var thisRekrutation = acctualRekruFile.waitingForCheck.find(r => r.userId == id);
                                thisRekrutation.showAtWnioski = false;
                                player.send("**Przykro mi. Twoja rekrutacja została odrzucona przez administracje.**");
                                this.kick(message, args, client)
                                anySwtichWasUsed = true;
                                break;
                        }
                        
                        if (anySwtichWasUsed == false) {
                            message.channel.send("W drugim parametrze musisz uwzględnić czy zatwierdzasz lub odrzucasz podanie. (Użycie komendy: d/accdec <nick/id> zatwierdz/odrzuc)");
                        }

                } else {
                    message.channel.send("Musisz podać w drugim parametrze czy chcesz zaakceptować czy odrzucić podanie");
                }

            } else {
                message.channel.send("Podaj prawidłowy nick/id osoby!")
            }

        } else {
            message.channel.send("Podaj nazwe gracza!")
        }

    },
    kick(message, args, client) {

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
                message.channel.send(`Użytkownik o ${player.user.username} został wyrzucony z gildi!`);

            } else {
                //poinformowanie o tym że wprowadzony nick/id jest błędny/e.
            }

        } else {
            //powiadomienie o tym ze nie został podany nick bądź id.
            message.channel.send("Podaj id/nick gracza którego chcesz wyrzucić!");
        }


    }
}
