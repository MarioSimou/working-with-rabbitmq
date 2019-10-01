import Rabbitmq from '../Rabbitmq'

const init = cb => cb()
init(async () => {
  const rabbitmq = new Rabbitmq({uri: process.env.RABBITMQ_URI })
  await rabbitmq.connect()  
  await rabbitmq.createExchange('logs','fanout',{durable: true})
  await rabbitmq.createQueue('my', {durable: true, autoDelete: false})
  await rabbitmq.bindQueueToExchange('my', 'logs')
  await rabbitmq.publish('logs','', Buffer.from('Hello world'))
})
