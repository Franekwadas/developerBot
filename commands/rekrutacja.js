module.exports = {

    "name": "rekrutacja",
    "description": "Rekrutacja gracza",

    execute(message, args, client) {

        if (typeof args[0] !== 'undefined') {

            var id = args[0].replace(/[\\<>@#&!]/g, "");

            var player = message.guild.members.cache.get(id)

            if (typeof player !== 'undefined') {

                message.guild.channels.create(`Rekrutacja użytkownika ${player.username}`);



            } else {
                message.channel.send("Podaj prawidłowe ID gracza!");
            }

        } else {
            message.channel.send("Podaj id/nazwę użytkownika");
        }

    }

}