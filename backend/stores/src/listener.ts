import { RabbitMQListener } from './infraestructure/adapters/input/rabbitmq/listener'
import { Queues } from './domain/constants/queues'

const listener = new RabbitMQListener()

listener.listen(Queues.STORE_QUEUE)
