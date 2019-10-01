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
  this._channel.assertExchange(...args)
}

Rabbitmq.prototype.createQueue = function(...args){
  this._channel.assertQueue(...args)
}
Rabbitmq.prototype.bindQueueToExchange = function(...args){
  this._channel.bindQueue(...args)
}

Rabbitmq.prototype.publish = function(...args){
  this._channel.publish(...args)
}

export default Rabbitmq