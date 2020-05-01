require('@babel/register') //чтобы использовать файлы с импорт, экспорт в ноуджээс
require('@babel/polyfill/noConflict')

const server = require('../../src/server').default

module.exports = async ()=>{
    global.httpServer = await server.start({
        port: 4000
    })
}