const Discord = require('discord.js');
const prefix = ".";
var client = new Discord.Client();
var NOTIFY_CHANNEL;

client.on('ready', () => {
    const guildNames = client.guilds.map(g => g.name).join("\n")
    client.user.setPresence({ game: { name: process.env.playing, type: 0 } });
    console.log('successfully Logged In As Link Bot!');
    NOTIFY_CHANNEL = client.channels.find("name", "member-links");
});
client.on ('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();  
  if (command === "link") {
      let gamemode = args[0];
      let region = args[1];
      let link = args[2];
      let verify = message.guild.roles.find("name", "link access")
      if (message.member.roles.has(verify.id)) {
          if (link.substr(0, 8) === 'https://') {
              let owner = message.member.user.tag
              const embed = new Discord.RichEmbed()
              .setColor(0x00FF00)
              .setURL(link)
              .setFooter('diep.io party link')
              .setTitle('Party Link')
              .setAuthor(owner)
              .addField("Gamemode", gamemode, true)
              .addField("Region", region, true)
              .addField("Link", link, true)
              .setTimestamp()
              NOTIFY_CHANNEL.send({embed})
              .then(function (message) {
                  message.react('🔗')
                  });
          }
          else {
              message.channel.send('Please include \"https://\" in your link.');
          }
      }
      else {
              message.author.send('You are not authorized to post links.');
          }          
}});    

client.on('messageReactionAdd', (reaction, user) => {
    const filter = (reaction, user) => reaction.emoji.name === "🔗";
    let collector = reaction.message.createReactionCollector(filter, { time: 7200000 });
    collector.on('collect', (reaction, collector) => {        
	    console.log('got a reaction');
        });
    
});

client.on ('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();  
  if (command === "help") {
    const embed = new Discord.RichEmbed()
      .setColor(0x00FF00)
      .setFooter('diep.io party link bot.')
      .setTitle('Party Link Bot Commands')
      .setAuthor('ReneageBB')
      .addField('!link', 'Usage: !link <gamemode> <region> <link> \n(Link must include \"https://\")', true)
      .addField('Recieving links', 'React to the link you would like to join and you will be messaged with the link. \nYou must have the \"link access\" role to post and recieve links.', true)
      .setTimestamp()
      message.channel.send({embed})
  }
});

client.login(process.env.BOT_TOKEN);
