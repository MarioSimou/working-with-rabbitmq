import rabbitmq from './util/client'
import { promisify } from 'util'

const queueName = 'direct.task'
const init = cb => cb()
const handleError = e => {
    process.stdout.write( [ e , '\n' ].join('') )
    process.exit(0)
} 

init( async () => {
    const client = await rabbitmq.connect( { uri : process.env.RABBITMQ_URI } )
    const handleChannel = promisify( client.createChannel ).bind( client )
    handleChannel()
    .then( channel => {
        let counter = 0;
        // sends a task to the queue every 5 seconds
        const sid = setInterval( () => {
            // either sended from command line
            // const message = process.argv.slice(2) // gets the second parameter passed from the command line
            // or generated with a random time from 0-10
            const message = `message=${Math.round(Math.random() * 10 )}`

            // creates queue if doesn't exist
            // durable : true -> Rabbitmq will never lose our queue  
            channel.assertQueue( queueName , { durable : true , autoDelete: false })
            // send a task to the queue - no aknowledegment is needed
            counter++
            // persistent : true -> messages won't lose after a Rabbitmq shutdown 
            channel.sendToQueue( queueName , Buffer.from( message ) , { persistent : true } )
            process.stdout.write( [ `[ Sending task: ${message} ]` , '\n'].join(''))
            if( counter > 500 ) clearInterval(sid)
        } , 5000 )
    })
    .catch( handleError )
})
