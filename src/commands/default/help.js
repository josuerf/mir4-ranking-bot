const Discord = require('discord.js')

module.exports = {
    name: "help",
    aliases: [""],
    run: async(client, message, args) => {
        message.reply({ embeds: [new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription('🤖 Lista de comandos\n#️⃣ rank start|stop: Define se o rankeamento está ou não em vigor.\n' +
                '#️⃣ process: Realiza o processamento do ranking'
            )
        ] }).then(msg => {
            setTimeout(() => msg.delete(), 20000)
        })
    }
}

