const Discord = require('discord.js')
const fs = require('fs')
const { google } = require('googleapis')
const { authorize } = require('../../sheets/sheets_auth.js')
const ranking = require('./../../ranking.json')

async function updateSheet() {
    const auth = await authorize()
    const sheets = google.sheets({ version: 'v4', auth })

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
        console.log('No data found.');
        return;
    }
    const resource = {
        values: ranking.map(p => [p.nick, p.power, p.epics, p.points, p.payment]),
    };
    
    await sheets.spreadsheets.values.update({
        spreadsheetId: '1TZQQYjeAuhlRZrhfjoZfhB4pomvXPxB3oPE7wlxylOk',
        range: 'Recompensa - NOSIDE!B3:G',
        valueInputOption: 'USER_ENTERED',
        resource
    })
}

module.exports = {
    name: "process",
    aliases: [""],
    run: async(client, message, args) => {
        message.reply({ embeds: [new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription(`🤖 Gerando Ranking... 🕗`)
        ] })

        try {
            await updateSheet()
        } catch (err) {
            message.reply({ embeds: [new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(`🤖 Falha ao atualizar a planilha. ⚠`)
            ] })
            fs.writeFileSync('./logs/error.log', `Erro ao atualizar a planilha: ${ JSON.stringify(err, null, 4) }`)
            return
        }

        message.reply({ embeds: [new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription(`🤖 Processamento Finalizado. ✅ `)
        ] })
    }
}

