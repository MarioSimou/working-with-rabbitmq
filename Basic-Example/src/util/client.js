import ampq from 'amqplib/callback_api'
let client;

export default {
    connect : async ({ uri }) => new Promise((resolve ,reject )=> {
        ampq.connect( uri , ( e , conn ) => {
            if( e ) reject( e )
            
            client = conn
            resolve(conn)
        })
    }),
    client : client
}