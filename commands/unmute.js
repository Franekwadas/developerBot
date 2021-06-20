const Discord = require('discord.js');

module.exports = {

    "name": "unmute",
    "description": "Odcisz gracza!",
    
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

        var punishments = client.punishmentsFile.find(g => g.guildId == message.guild.id); 

        if (typeof args[0] !== 'undefined') {

            var id = args[0].replace(/[\\<>@#&!]/g, "");
            var thisMute = punishments.mutes.find(u => u.userId == id);
            if (typeof thisMute === 'undefined') {
                message.channel.send("Ten gracz nie jest wyciszony!");
                return;
            }

            punishments.mutes.splice(punishments.mutes.indexOf(thisMute), 1);

            const embed = new Discord.MessageEmbed()
                .setColor('#fc1c03')
                .setTitle('Wykonano!')
                .setDescription(`**Odciszono gracza** <@${id}>`)
                .setFooter('Polecam się na przyszłość!')

            message.channel.send(embed);

        }

    }

}