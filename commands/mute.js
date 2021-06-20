const Discord = require('discord.js');

module.exports = {

    "name": "mute",
    "description": "Możesz tym wyciszyć gracza.",

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

        client.reloadConfig();

        var punishments = client.punishmentsFile.find(g => g.guildId == message.guild.id); 

        if (typeof args[0] !== 'undefined') {

            var id = args[0].replace(/[\\<>@#&!]/g, "");

            if (typeof punishments.mutes.find(u => u.userId == id) !== 'undefined') {
                message.channel.send("Ten gracz jest już wyciszony!");
                return;
            }

            var player = message.guild.members.cache.get(id);

            if (typeof player !== 'undefined') {
                
                if (typeof args[1] !== 'undefined') {

                    var reason = "";

                    if (typeof args[1] !== 'undefined' && args[1] != "") {
                        var length = args.length - 1;

                        for (let i = 1; i <= length; i++) {
                            reason = reason + args[i];
                            if (i != length) reason = reason + " ";
                        }
                    }

                    this.muteScript(id, reason, client, message);

                } else {

                    this.muteScript(id, false, client, message);

                }

            } else {

                message.channel.send("Podaj prawidłowe id gracza!");

            }

        } else {
            message.channel.send("Musisz podac id osoby którą chcesz wyciszyć!");
        }

    },
    muteScript(id, reason, client, message) {

        if (reason == false) {
            var punishments = client.punishmentsFile.find(g => g.guildId == message.guild.id);

            punishments.mutes.push({
                "userId": id,
                "reason": reason
            });

            const embed = new Discord.MessageEmbed()
                .setColor('#fc1c03')
                .setTitle('Wykonano!')
                .setDescription(`**Wyciszono gracza** <@${id}>\n**Powód:** ${reason}`)
                .setFooter('Polecam się na przyszłość!')

            message.channel.send(embed);

            return;
        } else {
            var punishments = client.punishmentsFile.find(g => g.guildId == message.guild.id);

            punishments.mutes.push({
                "userId": id,
                "reason": "Nie podano żadnego powodu"
            });

            const embed = new Discord.MessageEmbed()
                .setColor('#fc1c03')
                .setTitle('Wykonano!')
                .setDescription(`**Wyciszono gracza** <@${id}>\n**Powód nie został podany!**`)
                .setFooter('Polecam się na przyszłość!')

            message.channel.send(embed);

        }

    }

}