import rabbitmq from './util/client'
import { promisify } from 'util'

const queueName = 'direct.task'
const init = cb => cb()
const handleError = e => {
    process.stdout.write( [ e , '\n' ].join('') )
    process.exit(0)
} 

const doWork = message => {
    const sec = +message.split('=')[1]
    const start = Date.now()

    while(Date.now() - start < sec * 1000 ){}

    process.stdout.write([ `[ Just finished work after` , sec , 'seconds ]',  '\n'].join(' '))
} 

init( async () => {
    const client = await rabbitmq.connect( { uri : process.env.RABBITMQ_URI } )
    const handleChannel = promisify( client.createChannel ).bind( client )
    handleChannel()
    .then( channel => {
        // acknoledgment is enabled 
        channel.consume( queueName , message => {
            doWork( message.content.toString('utf8'))
            channel.ack(message)
        } , { noAck: false })

        // message aknowledgment - the work informs the queue that the process has finished
    })
    .catch( handleError )
})
