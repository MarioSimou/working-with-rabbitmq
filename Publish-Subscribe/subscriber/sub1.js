import Rabbitmq from '../../classes/Rabbitmq'

const init = cb => cb()
init(async ()=> {
  const queueName = 'publisher_event'
  const rabbitmq = new Rabbitmq({uri: process.env.RABBITMQ_URI })
  const processMsg = channel => msg => {
    const text = new TextDecoder('utf8').decode(msg.content)
    process.stdout.write(`Subscriber 1: ${text}\n`)
    channel.ack(msg)
  }

  await rabbitmq.connect()  
  await rabbitmq.consume(queueName, processMsg(rabbitmq._channel), {noAck: false})
})