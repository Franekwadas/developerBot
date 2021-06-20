const Discord = require('discord.js');

module.exports = {
    "name": "info",
    "description": "Komenda wypisuje krótką informację o bocie.",
    execute(message, args, client) {

        //by noszmata named dewidos

        var infoEmbed = new Discord.MessageEmbed().setColor('#34c6eb');

        if (args[0] == "-komendy") {
            infoEmbed.setTitle("Moje komendy :smiley:");

            for (const command of client.commands) {
                infoEmbed.addField(client.prefix + command[0], command[1].description, false);
            }
        } else {
            var description = `Nazywam się **DeveloperBOT**. Zostałem stworzony przez gracza, zwanego **Otptrashuo**, z tagiem **X**.\n\n**__Moje aktualne zadania to:__\nRekrutowanie pod komendą ${client.prefix}rekrutacja (o ile to skonfigurowałeś w configu), oraz ogólne zarządzanie serverem.`;

            infoEmbed.setTitle("**Informacje o mnie :smiley:**")
            .setDescription(description);
        }

        infoEmbed.setFooter("Polecam się na przyszłość :)");
        message.channel.send(infoEmbed);
    }
};