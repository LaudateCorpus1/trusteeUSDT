/**
 * Watch transaction unspent outputs (for usdt <- btc used)
 * @author Ksu
 * docker exec -t microtrustee /bin/bash -c "node /usr/microtrustee/micro_workers/watch_transactions_outputs/watch_transactions_outputs.js USDT"
 *
 * UPDATE transactions_blocks_list_details_usdt SET _scanned_output = 0 WHERE _scanned_output != 0;
 * TRUNCATE transactions_blocks_list_outputs_usdt;
 */
module.paths.push('/usr/lib/node_modules')

const db = require('../../micro_common/common/db').init('PUBLIC', 'PG')
const fncs = require('../../micro_common/debug/fncs').init()

async function init() {
    let currencyCode = process.argv[2] ? process.argv[2] : 'USDT'
    let divider = process.argv[3] ? process.argv[3] : '0'
    let time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    console.log(`${time} Started ${currencyCode} divider ${divider}`)
    try {
        const steps = require('./libs/WatchTransactionsOutputsSteps').init(db, currencyCode, divider)
        // noinspection InfiniteLoopJS
        try {
            await steps.step3()
        } catch (err) {
            await fncs.err(__filename.toString() + ' ' + currencyCode, err) //dont break a code
        }
    } catch (err) {
        if (db.end) db.end()
        await fncs.err(__filename.toString() + ' ' + currencyCode, err)
        process.exit(0)
    }
}

// noinspection JSIgnoredPromiseFromCall
init()
