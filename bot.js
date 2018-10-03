const Discord = require('discord.js');
const prefix = ".";
var client = new Discord.Client();
var link_channel;
var linkdb_channel;

client.on('ready', () => {
    const guildNames = client.guilds.map(g => g.name).join("\n")
    client.user.setPresence({ game: { name: process.env.playing, type: 0 } });
    console.log('successfully Logged In As Link Bot!');
    link_channel = client.channels.get('451417402119421952');
    linkdb_channel = client.channels.get('496855574940614657');
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
              .setFooter('diep.io party link')
              .setTitle('Party Link')
              .setAuthor(owner)
              .addField("Gamemode", gamemode, true)
              .addField("Region", region, true)
              .setTimestamp()
              link_channel.send({embed})
              .then(function (message) {
                  message.react('🔗')
                  });
              linkdb_channel.send(message.author.id + ' ' + link);
              async function links() {
                  const response = await linkdb_channel.fetchMessages()
                  console.log(response.map(r => r.content))
                  }
              console.log(links);
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
    if(reaction.emoji.name === '🔗') {
        let dm = reaction.users.map(r => r.id);
        let dmsend = dm[dm.length-1];
        let party = reaction.users.map(r => r.lastMessageID);
        let partysend = party[party.length-1];
        let log1 = reaction.users.map(r => r.username)
        let log2 = reaction.users.map(r => r.discriminator)
        let loguser = log1[log1.length-1] + '#' + log2[log2.length-1]
    }
});     


client.on ('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();  
  if (command === "help") {
    const embed = new Discord.RichEmbed()
      .setColor(0x00FF00)
      .setFooter('diep.io party link bot.')
      .setTitle('Party Link Bot Commands')
      .setAuthor('RenegadeBB')
      .addField('!link', 'Usage: !link <gamemode> <region> <link> \n(Link must include \"https://\")', true)
      .addField('Recieving links', 'React to the link you would like to join and you will be messaged with the link. \nYou must have the \"link access\" role to post and recieve links.', true)
      .setTimestamp()
      message.channel.send({embed})
  }
});

client.login(process.env.BOT_TOKEN);
