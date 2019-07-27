import rabbitmq from './client'

const init = cb => cb()

init(( async ()=> {
    const client = await rabbitmq.connect({ uri : process.env.RABBITMQ_URI , vhost : process.env.RABBITMQ_VHOST })
}))
