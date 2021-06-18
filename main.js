const Discord = require('discord.js');
const keepAlive = require('./server');
const Client = new Discord.Client();
const fs = require('fs');
const recrutationHandler = require('./recrutationHandler');
Client.commands = new Discord.Collection();
Client.configFile = JSON.parse(fs.readFileSync('./appconfig.json', 'utf8'));
Client.acctualRekru = JSON.parse(fs.readFileSync('./AcctualRekru.json', 'utf8'));
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    Client.commands.set(command.name, command);
}

Client.on('message', message => {

    const config = Client.configFile.find(p => p.guildId == message.guild.id);

    if(message.member.permissions.has('MANAGE_GUILD')) {
        if (message.content == "DeveloperBotSetup" && typeof config === 'undefined' && !message.author.bot) {

            Client.configFile.push({

                "guildId": message.guild.id,
                "prefix": "d/",
                "channelForRekrutation": "",
                "normalGuildMemberRole": "",
                "rekrutationRole": "",
                "moderatorRoles": [],
                "inConfiguration": true,
                "setingModeratorRoles": false

            })

            message.channel.send("Spinguj lub podaj id kanału na którym administratorzy będą przeprowadzać rekrutacje komendą d/rekrutacja");

            return;
        }

        if (message.content == "koniec") {
            if (config.setingModeratorRoles == true) {

                message.channel.send("Pomyślnie zakończono konfigurację bota!")
                config.inConfiguration = false;

            }
        }

        if (config.inConfiguration == true) {

            if (typeof config.channelForRekrutation === 'undefined') {

                if (!isNaN(message.content.replace(/<#>/, ""))) {

                    if (typeof message.guild.channel.cache.get(message.content.replace(/<#>/, "") !== 'undefined')) {

                        config.channelForRekrutation = message.content.replace(/<#>/, "");

                        message.channel.send("Teraz zpinguj role którą ma każdy normalny użytkownik (np. @👱‍♂️Member)");

                    } else {
                        message.channel.send("Spinguj lub podaj prawidłowe id kanału!");
                    }

                } else {
                    message.channel.send("Spinguj lub podaj prawidłowe id kanału!");
                }

            } else if (typeof config.normalGuildMemberRole === 'undefined') {

                if (!isNaN(message.content.replace(/<@&>/, ""))) {

                    if (typeof message.guild.roles.cache.get(message.content.replace(/<@&>/, "") !== 'undefined')) {

                        config.normalGuildMemberRole = message.content.replace(/<@&>/, "");

                        message.channel.send("Teraz zpinguj role którą ma każdy rekrutant (np. @🎭Rekrutant)");

                    } else {
                        message.channel.send("Spinguj lub podaj prawidłowe id roli!");
                    }

                } else {
                    message.channel.send("Spinguj lub podaj prawidłowe id roli!");
                }

            } else if (typeof config.rekrutationRole === 'undefined') {

                if (!isNaN(message.content.replace(/<@&>/, ""))) {

                    if (typeof message.guild.roles.cache.get(message.content.replace(/<@&>/, "") !== 'undefined')) {

                        config.rekrutationRole = message.content.replace(/<@&>/, "");
                        config.setingModeratorRoles = true;

                        message.channel.send("Teraz zpinguj **POJEDYŃCZO** role moderatorskie, a jak skończysz wpisz 'koniec'");

                    } else {
                        message.channel.send("Spinguj lub podaj prawidłowe id roli!");
                    }

                } else {
                    message.channel.send("Spinguj lub podaj prawidłowe id roli!");
                }

            } else if (config.setingModeratorRoles == true) {

                if (!isNaN(message.content.replace(/<@&>/, ""))) {

                    if (typeof message.guild.roles.cache.get(message.content.replace(/<@&>/, "") !== 'undefined')) {

                        config.moderatorRoles = config.moderatorRoles.push(message.content.replace(/<@&>/, ""));

                        message.channel.send("Dodano do ról moderatorskich!");

                    } else {
                        message.channel.send("Spinguj lub podaj prawidłowe id roli!");
                    }

                } else {
                    message.channel.send("Spinguj lub podaj prawidłowe id roli!");
                }

            }
        }
        return;
    }
    Client.prefix = config.prefix;

    if (!message.content.startsWith(Client.prefix) && !message.author.bot) {
        recrutationHandler(message, Client);
        return;
    }

    if (!message.content.startsWith(Client.prefix) || message.author.bot) return;

    const args = message.content.slice(Client.prefix.length).split(/ +/);
    var command = args.shift().toLowerCase();

    try {

        Client.commands.get(command).execute(message, args, Client);

    } catch (error) {

        message.channel.send(`Przykro mi ale nie znam takiej komendy. Jeśli chcesz zobaczyć moją liste komend wpisz ${Client.prefix}komendy.`);

        console.log(error);
    }

    Client.reloadConfig();
    
})

Client.reloadConfig = () => {

    try {
        var acctualRekru = Client.acctualRekru;
    } catch (error) {
      console.error(error);
    }

    fs.writeFileSync('./acctualRekru.json', JSON.stringify(acctualRekru));

}

keepAlive();
Client.login(process.env['TOKEN']);