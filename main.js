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