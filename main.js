const Discord = require('discord.js');
const keepAlive = require('./server');
const Client = new Discord.Client();
const fs = require('fs');
const recrutationHandler = require('./recrutationHandler');
Client.commands = new Discord.Collection();
Client.configFile = JSON.parse(fs.readFileSync('./appconfig.json', 'utf8'));
Client.acctualRekru = JSON.parse(fs.readFileSync('./AcctualRekru.json', 'utf8'));
Client.package = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
Client.punishmentsFile = JSON.parse(fs.readFileSync('./punishments.json', 'utf-8'));
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    Client.commands.set(command.name, command);
}

Client.once('ready', () => {

  Client.reloadConfig();
  console.log("[==---------Running bot---------==]\n");
  console.log("🤖 ・Application id: 849922535323729960");
  console.log(`📊 ・Version: ${Client.package.version}`);
  console.log(`🔧 ・Author: ${Client.package.author}\n`);
  console.log(`[==-----------------------------==]`);

  Client.user.setActivity("Prefix: d/", "LISTENING");
  

})

Client.on('message', async message => {

    if (message.author.bot) return;
    if (message.channel.type == "dm") return;

    Client.config = Client.configFile.find(g => g.guildId == message.guild.id);

    var punishments1 = Client.punishmentsFile.find(g => g.guildId == message.guild.id);

    if (typeof punishments1 === 'undefined') {

        Client.punishmentsFile.push({
            "guildId": message.guild.id,
            "mutes": []
        })

    }

    Client.reloadConfig();

    var punishments = Client.punishmentsFile.find(g => g.guildId == message.guild.id); 

    if (typeof punishments.mutes.find(u => u.userId == message.author.id) !== 'undefined') {
      if(typeof Client.config !== 'undefined') {
         Client.prefix = Client.config.prefix;
      } else {
        message.channel.messages.cache.get(message.id).delete();
        return;
      }
      if (message.content.startsWith(Client.prefix)) {
        if (Client.config.moderatorRoles.length <= 0) {
          return;
        }

        var hasPermission = false;

        Client.config.moderatorRoles.forEach(role => {

          if (message.member.roles.cache.has(role)) {
              hasPermission = true;
          }

        });

      }

      if (hasPermission != true) {
        message.channel.messages.cache.get(message.id).delete();
        return;
      }
    }

    if (message.member.permissions.has('MANAGE_GUILD')) {
      if (message.content.toLowerCase() == "developerbotsetup" && typeof  Client.config === 'undefined' && !message.author.bot) {

          Client.configFile.push({

              "guildId": message.guild.id,
              "prefix": "d/",
              "channelForRekrutation": "",
              "normalGuildMemberRole": "",
              "rekrutationRole": "",
              "moderatorRoles": [],
              "inConfiguration": true,
              "whoConfigurating": message.author.id,
              "setingModeratorRoles": false,
              "amountOfNone": 0

          })

          message.channel.send("Spinguj lub podaj id kanału na którym administratorzy będą przeprowadzać rekrutacje komendą d/rekrutacja");

          Client.reloadConfig();

          if (typeof Client.config === 'undefined' && !message.author.bot) {
            Client.config = Client.configFile.find(p => p.guildId == message.guild.id);
          } 

          return;
      }  

      Client.config = Client.configFile.find(p => p.guildId == message.guild.id);

      Client.prefix = Client.config.prefix;

      if (typeof Client.config === 'undefined') {
        message.author.send(`Witaj przyszedłem poinformować cię o nieskonfigurowanym bocie na serverze: ${message.guild.name}, aby to naprawić na serverze wpisz developerbotsetup bez prefixu`)
        return;
      }

      if (Client.config.inConfiguration == true && !message.author.bot) {
          if (message.author.id != Client.config.whoConfigurating) return;
          if (typeof Client.config.channelForRekrutation === 'undefined' || Client.config.channelForRekrutation == "") {

              if (message.content == "none") {
                Client.config.channelForRekrutation = "false";
                Client.config.amountOfNone = Client.config.amountOfNone + 1;
                message.channel.send("Teraz zpinguj role którą ma każdy normalny użytkownik (np. @👱‍♂️Member)");
                return;
              }

              var ChannelId = message.content.replace("<", "");
              ChannelId = ChannelId.replace("#", "");
              ChannelId = ChannelId.replace(">", "");

              if (!isNaN(ChannelId)) {

                  if (typeof message.guild.channels.cache.get(ChannelId) !== 'undefined') {

                      Client.config.channelForRekrutation = ChannelId;

                      message.channel.send("Teraz zpinguj role którą ma każdy normalny użytkownik (np. @👱‍♂️Member)");

                  } else {
                      message.channel.send("Spinguj lub podaj prawidłowe id kanału!");
                  }

              } else {
                  message.channel.send("Spinguj lub podaj prawidłowe id kanału!");
              }

          } else if (typeof Client.config.normalGuildMemberRole === 'undefined' || Client.config.normalGuildMemberRole == "") {

              if (message.content == "none") {
                Client.config.amountOfNone = Client.config.amountOfNone + 1;
                Client.config.normalGuildMemberRole = "false";
                message.channel.send("Teraz zpinguj role którą ma każdy rekrutant (np. @🎭Rekrutant)");
                return;
              }

              var RoleId = message.content.slice(3);
              RoleId = RoleId.replace(">", "");

              if (!isNaN(RoleId)) {

                  if (typeof message.guild.roles.cache.get(RoleId) !== 'undefined') {

                      Client.config.normalGuildMemberRole = RoleId;

                      message.channel.send("Teraz zpinguj role którą ma każdy rekrutant (np. @🎭Rekrutant)");

                  } else {
                      message.channel.send("Spinguj lub podaj prawidłowe id roli!");
                  }

              } else {
                  message.channel.send("Spinguj lub podaj prawidłowe id roli!");
              }

          } else if (typeof Client.config.rekrutationRole === 'undefined' || Client.config.rekrutationRole == "") {

              if (message.content == "none") {
                Client.config.amountOfNone = Client.config.amountOfNone + 1;
                Client.config.rekrutationRole = "false";
                message.channel.send("Teraz zpinguj **POJEDYŃCZO** role moderatorskie, a jak skończysz wpisz 'koniec'");
                Client.config.setingModeratorRoles = true;
                return;
              }

              var RoleId = message.content.slice(3);
              RoleId = RoleId.replace(">", "");

              if (!isNaN(RoleId)) {

                  if (typeof message.guild.roles.cache.get(RoleId) !== 'undefined') {

                      Client.config.rekrutationRole = RoleId;
                      Client.config.setingModeratorRoles = true;

                      message.channel.send("Teraz zpinguj **POJEDYŃCZO** role moderatorskie, a jak skończysz wpisz 'koniec'");

                  } else {
                      message.channel.send("Spinguj lub podaj prawidłowe id roli!");
                  }

              } else {
                  message.channel.send("Spinguj lub podaj prawidłowe id roli!");
              }

          } else if (Client.config.setingModeratorRoles == true) {

              Client.prefix = Client.config.prefix;

              if (message.content == "koniec") {
                try {
                  if (Client.config.amountOfNone < 3) {
                    message.channel.send("**Pomyślnie zakończono konfigurację bota!**");
                  } else {
                    message.channel.send(`**Uwaga**\nPrzy takiej ilości niezdefiniowanych wartości w bocie może dochodzić do różnego rodzaju błędów\nJeżeli chcesz to naprawić użyj komendy ${Client.prefix}resetconfig, a następnie wpisz developerbotsetup`);
                  }
                  
                  Client.config.inConfiguration = false;
                  Client.config.setingModeratorRoles = false;
                  Client.reloadConfig();
                  return;
                } catch (error) {
                  console.error(error);
                }
                
              }

              var RoleId = message.content.slice(3);
              RoleId = RoleId.replace(">", "");

              if (!isNaN(RoleId)) {

                  if (typeof message.guild.roles.cache.get(RoleId) !== 'undefined') {

                    Client.config.moderatorRoles.push(`${RoleId}`);

                    message.channel.send("Dodano do ról moderatorskich!");

                  } else {
                      message.channel.send("Spinguj lub podaj prawidłowe id roli!");
                  }

              } else {
                  message.channel.send("Spinguj lub podaj prawidłowe id roli!");
              }

            }
        }
        if (typeof Client.config === 'undefined') return;
        Client.reloadConfig();
        if (Client.config.inConfiguration == true && Client.whoConfigurating == message.author.id) {
          return;
       }
    }
    
    

    Client.config = Client.configFile.find(p => p.guildId == message.guild.id);
    if (typeof Client.config !== 'undefined') {
      Client.prefix = Client.config.prefix;
    } else {
      return;
    }

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

        message.channel.send(`Przykro mi ale nie znam takiej komendy. Jeśli chcesz zobaczyć moją liste komend wpisz ${Client.prefix}info -komendy.`);

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

    fs.writeFileSync('./AcctualRekru.json', JSON.stringify(acctualRekru));

    try {
      var config = Client.configFile;
    } catch (error) {
      console.error(error);
    }

    fs.writeFileSync('./appconfig.json', JSON.stringify(config));

    try {
      var punishments = Client.punishmentsFile;
    } catch (error) {
      console.error(error);
    }

    fs.writeFileSync('./punishments.json', JSON.stringify(punishments));
}

keepAlive();
Client.login(process.env['TOKEN']);