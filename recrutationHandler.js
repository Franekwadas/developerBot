const { MessageEmbed } = require("discord.js");

module.exports = (message, client) => {
    var acctualRekruFile = client.acctualRekru.find(g => g.guildId == message.guild.id);
    
    var thisRecrutation = acctualRekruFile.acctualRekrutation.find(r => r.channelId == message.channel.id);

    if (typeof thisRecrutation === 'undefined') return;
    
    const messageFetched = message;

    let lines = messageFetched.content.split("\n");

    lines.forEach(l => lines[lines.indexOf(l)] = l.split(": "));

    var name, age, why, interests, gameExperience;

    try {
        if (lines.length != 5) throw new Error("Za mało pól!");

        if (message.author.id != thisRecrutation.userId) throw new Error("Administratorze, nie rekrutujemy Ciebie :)");

        let nameLine = lines.find(l => ["jak masz na imię", "jak masz na imie"].includes(l[0].toLowerCase()));

        if (typeof nameLine === 'undefined') throw new Error("Nie podałeś swojego imienia!");

        name = nameLine[1];

        let ageLine = lines.find(l => l[0].toLowerCase() == "ile masz lat");

        if (typeof ageLine === 'undefined') throw new Error("Nie podałeś swojego wieku!");

        age = parseInt(ageLine[1]);

        if (typeof age === 'undefined' || isNaN(age)) throw new Error("Wiek musi być liczbą!");

        if (age >= 130) throw new Error("Na pewno nie jesteś aż tak stary!");

        if (age < 13) throw new Error("Nie przyjmujemy osób poniżej 13 roku życia!");

        let whyLine = lines.find(l => ["dlaczego mielibyśmy ciebie wybrać?", "dlaczego mielibysmy ciebie wybrac?", "dlaczego mielibyśmy ciebie wybrać", "dlaczego mielibysmy ciebie wybrac"].includes(l[0].toLowerCase()));

        if (typeof whyLine === 'undefined') throw new Error("Musisz nam wskazać powody, aby Ciebie wybrać!");

        why = whyLine[1];
        
        let interestsLine = lines.find(l => ["jakie są twoje zainteresowania", "jakie sa twoje zainteresowania"].includes(l[0].toLowerCase()));

        if (typeof interestsLine === 'undefined') throw new Error("Wypisz nam swoje zainteresowania!");

        interests = interestsLine[1];

        let gameExperienceLine = lines.find(l => ["jakie masz doświadczenie w grach", "jakie masz doswiadczenie w grach", "jakie masz doświadczenie w grach?", "jakie masz doswiadczenie w grach?"].includes(l[0].toLowerCase()));

        if (typeof gameExperienceLine === 'undefined') throw new Error("Chcemy także wiedzieć jakie masz doświadczenie w grach!");

        gameExperience = gameExperienceLine[1];
    } catch (error) {
        message.channel.send(error.message);
        return;
    }

    var araj = ["d", "d"];

    araj.splice

    acctualRekruFile.waitingForCheck.push({
        "userId": message.author.id,
        "name": name,
        "age": age,
        "why": why,
        "interests": interests,
        "gameExperience": gameExperience
    });

    acctualRekruFile.acctualRekrutation.splice(acctualRekruFile.acctualRekrutation.indexOf(thisRecrutation), 1);

    var embed = new MessageEmbed()
    .setColor('#b8860b')
    .setTitle("Twój wniosek rekrutacyjny oczekuje na sprawdzenie!")
    .setDescription("Za niedługo ktoś z administracji sprawdzi twój wniosek!");

    embed.addField("Twój nick", `<@${message.author.id}>`, false);
    embed.addField("Twoje imię", `${name}`, false);
    embed.addField("Twój wiek", `${age}`, false);
    embed.addField("Dlaczego chcesz do nas dołączyć?", `${why}`, false);
    embed.addField("Twoje zainteresowania", `${interests}`, false);
    embed.addField("Twoje doświadczenie w grach", `${gameExperience}`, false);

    message.channel.send(embed);

    client.reloadConfig();
}