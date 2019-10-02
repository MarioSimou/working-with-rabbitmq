import amqp from 'amqplib/callback_api'
import { promisify } from 'util'

function Rabbitmq(props){
  if(!(this instanceof Rabbitmq)){
    return new Rabbitmq(props)
  }

  if(!props.uri) throw new Error('You did not pass a uri parameter')
  
  this._uri = props.uri
  this._connection = null
  this._channel = null
} 

Rabbitmq.prototype.connect = async function(){
  try {

    const connection = await promisify(amqp.connect).call(amqp)
    const channel = await promisify(connection.createChannel).call(connection)

    this._channel = channel
    this._connection = connection
    return channel
  } catch( e ){
    throw new Error(e)
  }
}

Rabbitmq.prototype.createExchange = function(...args){
  return promisify(this._channel.assertExchange).apply(this._channel, this._parseArgs(args,3))
}

Rabbitmq.prototype.createQueue = function(...args){
  return promisify(this._channel.assertQueue).apply(this._channel, this._parseArgs(args,2))
}

Rabbitmq.prototype.bindQueueToExchange = function(...args){
  return promisify(this._channel.bindQueue).apply(this._channel, this._parseArgs(args,4))
}

Rabbitmq.prototype.publish = function(...args){
  return  promisify(this._channel.publish).apply(this._channel, this._parseArgs(args,4))
}

Rabbitmq.prototype.consume = function(...args){
  return promisify(this._channel.consume).apply(this._channel, this._parseArgs(args,3))
}

Rabbitmq.prototype._parseArgs = function(args,size){
  return new Array(size).fill(undefined).map((_,i) => args[i])
}

export const TYPES = {
  EXCHANGE : {
    FANOUT: 'fanout',
    TOPIC: 'topic',
    DIRECT: 'direct',
    HEADERS: 'headers'
  }
}
Object.freeze(TYPES)


export default Rabbitmq