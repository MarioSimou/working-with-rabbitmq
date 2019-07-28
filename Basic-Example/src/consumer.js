import rabbitmq from './util/client'
import { promisify } from 'util'
import { RABBIT_INFO } from './util/contants'

const init = cb => cb()
const handleError = e => {
    process.stdout.write( [ e , '\n'].join('') )
    process.exit(0)
}

init(( async ()=> {
    const client = await rabbitmq.connect({ uri : process.env.RABBITMQ_URI })
    const handleChannel = promisify(client.createConfirmChannel).bind(client)
    handleChannel()
    .then( channel => {
        // constantly listening for new message
        channel.consume( RABBIT_INFO.QUEUE.HELLO , message => {
            process.stdout.write(`[ ${message.content.toString()}]\n`)
            channel.ack( message ) // acknowledging the message
            })    
    })
    .catch(handleError)
}))
