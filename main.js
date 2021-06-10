const Discord = require('discord.js');
const Client = new Discord.Client();
const fs = require('fs');
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

    Client.prefix = config.prefix;

    if (!message.content.startsWith(Client.prefix) || message.author.bot) return;

    const args = message.content.slice(Client.prefix.length).split(/ +/);
    var command = args.shift().toLowerCase();
    console.log(command);

    try {

        Client.commands.get(command).execute(message, args, Client);

    } catch (error) {

        message.channel.send(`Przykro mi ale nie znam takiej komendy. Jeśli chcesz zobaczyć moją liste komend wpisz ${Client.prefix}komendy.`);

        console.log(error);
    }
})


Client.login('ODQ5OTIyNTM1MzIzNzI5OTYw.YLiOCw.wLGDLv7IH5Lw_ox4EbTTmTmDRDI');