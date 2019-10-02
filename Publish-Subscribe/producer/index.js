import Rabbitmq, { TYPES } from '../../classes/Rabbitmq'

const init = cb => cb()
init(async () => {
  const exchangeName = 'logs'
  const queueName = 'publisher_event'
  const rabbitmq = new Rabbitmq({uri: process.env.RABBITMQ_URI })
  await rabbitmq.connect()  
  await rabbitmq.createExchange(exchangeName, TYPES.EXCHANGE.FANOUT)
  await rabbitmq.createQueue(queueName, {durable: true})
  await rabbitmq.bindQueueToExchange(queueName,exchangeName, '')
  
  let c = 0;
  let timerId = setInterval(()=> {
    const msg = `Message sent at counter: ${++c}`
    rabbitmq.publish(exchangeName, '', Buffer.from(msg))
    if(c === 100) clearInterval(timerId)
  },100)
})
