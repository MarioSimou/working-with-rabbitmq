import amqp from 'amqplib/callback_api'
let client

export default {
    connect: ({ uri }) => new Promise((resolve,reject)=> {
        amqp.connect( uri , ( e , conn ) => {
            if( e ) reject ( e ) 

            client = conn
            resolve( conn )
        })
    }),
    client : client
}