const fs = require('fs')
const config = require('./../../config.json')
const ranking = require('./../../ranking.json')
const Discord = require('discord.js')

module.exports = {
    name: "savePlayer",
    aliases: [""],
    run: async(client, message, args) => {
        const getErrors = (info) => {
            const errorMsgs = {
                mNick: '- Seu nick não é suportado',
                mLevel: '- O level informado deve conter somente números',
                mPower: '- O Power informado deve conter somente números, pontos ou virgula',
                epics: '- O valor dos itens épicos deve conter somente números'
            }
            const errors = []
            Object.keys(info).forEach(k => {
                if (!info[k]) {
                    errors.push(errorMsgs[k])
                }
            })
            return errors
        }

        const mNick = message.content.match(/(?<=[nN]ick:[\s\S]).+/g)
        const mLevel = message.content.match(/(?<=[Ll]evel:[\s\S])\d+/g)
        const mPower = message.content.match(/(?<=[Pp]ower:[\s\S])[\d.,]+/g)
        const epics = message.content.match(/(?<=[Ii]tens [ÉéEe]picos:[\s\S])[\d]+/g)

        const errors = getErrors({ mNick, mLevel, mPower, epics })
            
        if (errors.length > 0) {
            const embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(`Ajuste o(s) seguinte(s) erro(s):\n${ errors.join('\n') }`)
            
            message.reply({ embeds: [embed] }).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000)
            })
            return
        }

        let player = ranking.find(p => message.author.id)

        const points = (
            (Number.parseInt(epics[0]) * 10)
            + (Number.parseFloat(mPower[0].replace(/[.,]/g, '')) / 10000) 
            + Number.parseInt(mLevel[0])
        ).toFixed(2)

        if (!player) {
            player = {
                id: message.author.id,
                points,
                nick: mNick[0],
                level: mLevel[0],
                epics: epics[0],
                power: mPower[0],
                payment: 20,
                rank: 0
            }
        } else {
            player = {
                ...player,
                points
            }
            const idx = ranking.findIndex(r => r.id === player.id)
            ranking.splice(idx, 1)
        }
        ranking.push(player)

        ranking.sort((a, b) => a.points - b.points).forEach((r, i) => {
            r.rank = i + 1
            r.payment = (i + 1) <= 10 ? 20 : (i + 1) <= 20 ? 15 : ''
        })

        const embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription(`🎉 Parabéns ${ mNick[0] }, você agora é o ${ player.rank }º 🔥 do ranking 🚀`)
        
        message.reply({ embeds: [embed] }).then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 20000)
        })

        fs.writeFileSync('./ranking.json', JSON.stringify(ranking, null, 4))
    }
}
