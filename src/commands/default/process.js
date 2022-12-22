const Discord = require('discord.js')
const fs = require('fs')
const { google } = require('googleapis')
const { authorize } = require('../../sheets/sheets_auth.js')
const ranking = require('../../ranking.json')

async function updateSheet() {
    const auth = await authorize()
    const sheets = google.sheets({ version: 'v4', auth })

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: '1TZQQYjeAuhlRZrhfjoZfhB4pomvXPxB3oPE7wlxylOk',
        range: 'Recompensa - NOSIDE!B3:G'
    })

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
        console.log('No data found.');
        return;
    }
    const resource = {
        values: ranking.map(p => [p.nick, p.power, p.epics, p.points, p.payment, p.clan]),
    };
    
    await sheets.spreadsheets.values.update({
        spreadsheetId: '1TZQQYjeAuhlRZrhfjoZfhB4pomvXPxB3oPE7wlxylOk',
        range: 'Recompensa - NOSIDE!B3:G',
        valueInputOption: 'USER_ENTERED',
        resource
    })
}

function padRight(num, padlen = 1, padchar = ' ') {
    var pad = new Array(1 + padlen).join(padchar)
    return (num + pad).slice(0, (num.length + padlen))
}

module.exports = {
    name: "process",
    aliases: [""],
    run: async(client, message, args) => {
        const msgGenerating = await message.reply({ embeds: [new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription(`🤖 Gerando Ranking... 🕗`)
        ] })

        try {
            //await updateSheet()
            const rankingChannel = client.channels.cache.find(channel => channel.name === 'players-ranking')
            const lastMessage = await rankingChannel.messages
                .fetch({ limit: 1 })
                .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null))
            const lastDate = lastMessage ? new Date(lastMessage.createdTimestamp - 10800000).toLocaleDateString('pt-BR') : '-'
            const msg = `🤖 Ranking Referente a ${ lastDate } até ${ new Date(Date.now()).toLocaleDateString('pt-BR') }\n\n`
                + `${padRight('#', 7)}${padRight('Nick', 21)}${padRight('Power', 15)}${ padRight('Clan', 26) }\n`
                + ranking.map(p => `${padRight(p.rank.toString(), 8 - p.rank.toString().length)}${padRight(p.nick, 25 - p.nick.length)}${padRight(p.power, 20 - p.power.toString().length)}${padRight(p.clan,  30 - p.clan.length)}` ).join('\n')
            rankingChannel.send(`\`\`\`${msg}\`\`\``)
        } catch (err) {
            console.error(err)
            msgGenerating?.delete()
            message.reply({ embeds: [new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(`🤖 Falha ao atualizar a planilha. ⚠`)
            ] })
            fs.writeFileSync('./src/logs/error.log', `Erro ao atualizar a planilha: ${ JSON.stringify(err, null, 4) }`)
            return
        }

        msgGenerating?.delete()

        message.reply({ embeds: [new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription(`🤖 Processamento Finalizado. ✅ `)
        ] })
    }
}

