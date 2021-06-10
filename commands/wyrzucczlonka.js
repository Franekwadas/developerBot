module.exports = {

    "name": "wyrzuc",
    "description": "Wyrzuć członka z servera",

    execute(message, args, client) {

        //sprawdzanie czy został podany nick/id gracza.
        if (typeof args[0] !== 'undefined') {

            //sprawdzanie czy podany gracz istnieje
            var id = args[0].replace(/[\\<>@#&!]/g, "");

            var player = message.guild.members.cache.get(id);

            if(typeof player !== 'undefined') {

                //główny kod

                player.kick();
                message.channel.send(`Użytkownik o ${player.username} został wyrzucony z gildi!`);

            } else {
                //poinformowanie o tym że wprowadzony nick/id jest błędny/e.
            }

        } else {
            //powiadomienie o tym ze nie został podany nick bądź id.
            message.channel.send("Podaj id/nick gracza którego chcesz wyrzucić!");
        }

    }
}