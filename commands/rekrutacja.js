const Discord = require('discord.js')

module.exports = {

    "name": `rekrutacja`,
    "description": "Rekrutacja gracza",

    async execute(message, args, client) {

        
        if (typeof args[0] !== 'undefined') {

            var id = args[0].replace(/[\\<>@#&!]/g, "");

            var acctualRekruFile = client.acctualRekru.find(g => g.guildId == message.guild.id);

            var rekrutacjaTegoGracza = acctualRekruFile.acctualRekrutation.find(r => r.userId == id);

            if (typeof rekrutacjaTegoGracza !== 'undefined') {
                message.channel.send("Ten gracz jest w trakcie rekrutacji!");
                return;
            }

            var player = message.guild.members.cache.get(id)

            if (typeof player !== 'undefined') {

                const Channel = await message.guild.channels.create(`Rekrutacja użytkownika ${player.user.username}`);

                Channel.setParent('852250534270074880');
                Channel.updateOverwrite(message.guild.id, {

                    SEND_MESSAGE: false,
                    VIEW_CHANNEL: false,
                });
        
                Channel.updateOverwrite(player, {
        
                    SEND_MESSAGE: true,
                    VIEW_CHANNEL: true,
        
                });
                var embed = new Discord.MessageEmbed()
                .setColor('#34c6eb')
                .setTitle(`Witaj ${player.user.username}`)
                .setDescription(`**Napisz podanie w takim formacie: \n\nJak masz na imię: \nIle masz lat: \nDlaczego mielibyśmy ciebie wybrać?: \nJakie są twoje zainteresowania: \nJakie masz doświadczenie w grach?: \n\nPrzykładowe podanie:\n\n Jak masz na imię: maciek\nIle masz lat: 10\nDlaczego mielibyśmy ciebie wybrać?: Bo tak\nJakie są twoje zainteresowania: Nie wiem a twoje?\nJakie masz doświadczenie w grach: W czym?**`)
                .setFooter("Polecam się na przyszłość :)");

                acctualRekruFile.acctualRekrutation.push({

                    "userId": id

                });

                await Channel.send(embed);

            } else {
                message.channel.send("Podaj prawidłowe ID gracza!");
            }

        } else {
            message.channel.send("Podaj id/nazwę użytkownika");
        }

    }

}