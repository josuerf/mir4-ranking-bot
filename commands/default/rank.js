const fs = require('fs')
const config = require('./../../config.json')
const Discord = require('discord.js')

module.exports = {
    name: "rank",
    aliases: [""],
    run: async(client, message, args) => {
        if (!['start', 'stop'].includes(args[0].toLowerCase())) {
            const embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription('Argumento inválido, suportados: Start e Stop')

            message.reply({ embeds: [embed] }).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000)
            })
            return
        }

        config.watch = args[0].toLowerCase() === 'start'
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))

        const embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription('Ranqueamento iniciado ㊙, a partir deste ponto, mensagens serão deletadas após 5 segundos. 🤖')
            
        message.reply({ embeds: [embed] }).then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000)
        })
    }
}
