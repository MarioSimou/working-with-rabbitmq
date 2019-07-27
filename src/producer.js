import ampq from './util/client'
import { EVENTS , RABBIT_INFO } from './util/contants'
import { promisify } from 'util'

const init = cb => cb()
const handleError = e => {
    process.stdout.write( [ e , '\n'].join('') )
    process.exit(0)
}

init(( async ()=> {
    // initiates a connection with rabbitmq - ampq://guest:guest@locahost:5672/hello
    const client = await ampq.connect({ uri : process.env.RABBITMQ_URI })
    // creates a Promise of the current channel
    const handleChannel = promisify( client.createConfirmChannel ).bind( client )
    handleChannel()
    .then( channel => {
        channel.on( EVENTS.ERROR , handleError )
        channel.on( EVENTS.CLOSE , handleError )
        
        // every 2 seconds a "Hello World" message is published to the queue with name hello
        let counter = 0 , message = 'Hello World'
        const sid = setInterval( () => {
            channel.publish( RABBIT_INFO.EXHCANGE.HELLO, RABBIT_INFO.ROUTING_KEY.HELLO , Buffer.from(`${message} ${counter}`) , { persistent: true })
            process.stdout.write(`[ ${message} ${counter} ]\n`)
            counter++
            if( counter >=  200 ) clearInterval( sid )
        }, 2000 , message , counter)
    })
    .catch(handleError)
}))
