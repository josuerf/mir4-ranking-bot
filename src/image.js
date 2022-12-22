
const { createWorker } = require('tesseract.js')

let worker

/**
 * Extrai o nome do clan do print do jogador.
 * @param {string|Blob|File} image imagem do player
 */
async function extractClanNameFrom(image) {
    const { data: { text } } = await worker?.recognize(image)
    const lines = text.split('\n')

    const noside = lines.some(l => l.toLowerCase().endsWith('side'))

    console.log(lines)

    return noside ? 'NOSIDE' : 'UNSIDED'
}

async function loadWorker() {
    worker = await createWorker({
        logger: e => console.log(e)
    })
    
    await worker.loadLanguage('por')
    await worker.initialize('por')
}

loadWorker().then(() => extractClanNameFrom('./src/image4.png'))

module.exports = {
    extractClanNameFrom
}
