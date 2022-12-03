const Discord = require('discord.js')
const config = require('./config.json')
const fs = require('fs')

const client = new Discord.Client({ intents: [1, 512, 32768, 2, 128, 1024] })

client.login(config.token)

client.aliases = new Discord.Collection()
client.commands = new Discord.Collection()
client.categories = fs.readdirSync('./commands/')

const prefix = config.prefix

fs.readdirSync('./commands/').forEach(local => {
    const commandsFile = fs.readdirSync(`./commands/${ local }`).filter(file => file.endsWith('.js'))

    commandsFile.forEach(c => {
        const innerCommand = require(`./commands/${ local }/${ c }`)

        if (innerCommand.name)
            client.commands.set(innerCommand.name, innerCommand)
        if (innerCommand.aliases && Array.isArray(innerCommand.aliases))
            innerCommand.aliases.forEach(i => client.aliases.set(i, innerCommand.name))
    })
})

client.on("messageUpdate", async (oldMessage, newMessage) => {
})
client.on("messageCreate", async (message) => {
    const meetRequirements = treatRules(client, message)

    if (message.author.bot || message.channel.type == 'dm')
        return
    if (message.content.startsWith(prefix) && meetRequirements) {
        processCommand(client, message)
    } else if (message.attachments.size === 1) {
        processCommand(client, message, 'savePlayer')
    } else {
        if (!config.watch) {
            message.delete()
        }
    }
})

client.on("ready", () => {
    console.warn(`🔥 Bot Online ${ client.user.username }`)
})

function treatRules(client, message) {
    let valid = true
    const user = message.author
    const target = message.guild.members.cache
        .find(m => m.id === user.id)
    const mroles = target.roles.cache
        .filter(r => r.name !== '@everyone')
        .map(role => role.name)

    if (!mroles.some(m => ['Líder', 'DEV. Reforged'].includes(m))) {
        valid = false
    }
    if (message.channelId !== '1047913265415602256' && // PrintChar
        message.channelId !== '1048379569499013213' && // Próprio
        message.channelId !== '694023268990058509' // Zé
        ) 
    {
        valid = false
    }

    return valid
}

function processCommand(client, message, manualCommand = null) {
    let cmd = manualCommand
    let cmdFound
    let args = []

    if (!cmd) {
        args = message.content.slice(prefix.length).trim().split(/ +/g)
        cmd = args.shift().toLowerCase()

        cmdFound = null

        if (cmd.length === 0)
            return
    }

    cmdFound = client.commands.get(cmd)

    if (!cmdFound) {
        cmdFound = client.commands.get(client.aliases.get(cmd))
    }

    try {
        if (cmdFound) {
            cmdFound.run(client, message, args)
        }
    } catch (err) {
        console.error('Error: ' + err)
    }
}