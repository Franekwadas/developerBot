const Discord = require('discord.js');
const Client = new Discord.Client();
const fs = require('fs');
Client.commands = new Discord.Collection();
Client.configFile = JSON.parse(fs.readFileSync('./appconfig.json', 'utf8'));
const CommandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of CommandFiles) {

    const command = require(`./commands/${file}`);

    Client.commands.set(command.name, command);

}

Client.on('message', message => {

    const config = Client.configFile.find(p => p.guildId == message.guild.id);

    Client.prefix = config.prefix;

    if (!message.content.startsWith(Client.prefix) || message.author.bot) return;

    
})


Client.login('ODQ5OTIyNTM1MzIzNzI5OTYw.YLiOCw.wLGDLv7IH5Lw_ox4EbTTmTmDRDI');