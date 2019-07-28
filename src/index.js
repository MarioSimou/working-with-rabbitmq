import rabbitmq from './util/client'

const init = cb => cb()
const handleError = e => {
    process.stdout.write( [ e , '\n' ].join('') )
    process.exit(0)
} 

init( async () => {
    const connection = await rabbitmq.connect( { uri : process.env.RABBITMQ_URI } )
})
