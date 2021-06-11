const Discord = require('discord.js');

module.exports = {

    "name": "wnioski",
    "description": "Sprawdz podania graczy",

    execute(message, args, client) {

        var acctualRekruFile = client.acctualRekru.find(g => g.guildId == message.guild.id);

        if (typeof args[0] === 'undefined') {
            
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

            if (message.channel.id != config.channelForRekrutation) {
                message.channel.send(`Do tej komendy jest przeznaczony specjalny kanał: <#${config.channelForRekrutation}>`);
                return;
            }

            var embed = new Discord.MessageEmbed()
            .setTitle("Wnioski rekrutacyjne")
            .setThumbnail('https://cdn.discordapp.com/attachments/852894771206684703/852901300705165352/text3d.png')
            .setColor("#FF1493")
            .setFooter("To wszystkie aktualne podania do zespołu.")

            var anyRekrutationExist = false;
            var podanie;

            for (let i = 0; i < acctualRekruFile.waitingForCheck.length; i++) {
                podanie = acctualRekruFile.waitingForCheck.find(p => parseInt(p.id) == i+1);
                if (podanie.showAtWnioski == true){
                    embed.addField(`Wniosek numer  ${i+1}`, `Podanie gracza: <@${podanie.userId}>\nImie: ${podanie.name}\nWiek: ${podanie.age}\nDlaczego mielibyście go wybrać?: ${podanie.why}\nZainteresowania: ${podanie.interests}\nJego doświadczenie w grach: ${podanie.gameExperience}` , false);
                    anyRekrutationExist = true;
                }   
            }

            if (anyRekrutationExist == false) {

                var embed2 = new Discord.MessageEmbed()
                .setAuthor("Rekrutation menager")
                .setTitle("Wnioski rekrutacyjne")
                .setThumbnail('https://cdn.discordapp.com/attachments/852894771206684703/852901300705165352/text3d.png')
                .setDescription("Aktualnie nie ma żadnego podania!")
                .setColor("#FF1493")

                message.channel.send(embed2);

                return;

            }

            message.channel.send(embed);

        } else {

            message.channel.send("Ta komenda nie wymaga argumentów!");

        }

    }

}