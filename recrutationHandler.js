module.exports = (message, client) => {
    var acctualRekruFile = client.acctualRekru.find(g => g.guildId == message.guild.id);
    
    var thisRecrutation = acctualRekruFile.acctualRekrutation.find(r => r.channelId == message.channel.id);

    if (typeof thisRecrutation === 'undefined') return;
    
    const messageFetched = message;

    console.log(messageFetched);
    let lines = messageFetched.content.split("\n");

    lines.forEach(l => lines[lines.indexOf(l)] = l.split(": "));

    var name, age, why, interests, gameExperience;

    try {
        if (lines.length != 3) throw new Error();

        let nameLine = lines.find(l => ["jak masz na imię", "jak masz na imie"].includes(l[0].toLowerCase()));

        if (typeof nameLine === 'undefined') throw new Error();

        name = nameLine[1];

        let ageLine = lines.find(l => l[0].toLowerCase() == "ile masz lat");

        if (typeof ageLine === 'undefined') throw new Error();

        age = parseInt(ageLine[1]);

        if (typeof age === 'undefined' || isNaN(age)) throw new Error();

        let whyLine = lines.find(l => ["dlaczego mielibyśmy ciebie wybrać?", "dlaczego mielibysmy ciebie wybrac?", "dlaczego mielibyśmy ciebie wybrać", "dlaczego mielibysmy ciebie wybrac"].includes(l[0].toLowerCase()));

        if (typeof whyLine === 'undefined') throw new Error();

        why = whyLine[1];
        
        let interestsLine = lines.find(l => ["jakie są twoje zainteresowania", "jakie sa twoje zainteresowania"].includes(l[0].toLowerCase()));

        if (typeof interestsLine === 'undefined') throw new Error();

        interests = interestsLine[1];

        let gameExperienceLine = lines.find(l => ["jakie masz doświadczenie w grach", "jakie masz doswiadczenie w grach"].includes(l[0].toLowerCase()));

        if (typeof gameExperienceLine === 'undefined') throw new Error();

        gameExperience = gameExperienceLine[1];
    } catch (error) {
        message.channel.send("Błędny format wniosku rekrutacyjnego!");
        return;
    }

    message.channel.send("POTRZEBUJEMY CIE W NASZYM SKŁADZIE");
}