import { RabbitMQListener } from './infraestructure/adapters/input/rabbitmq/listener'
import { Queues } from './domain/constants/queues'
import { settings } from './infraestructure/config/settings'
import Logger from './infraestructure/config/logger'

Logger.info(`${JSON.stringify(settings)}`)

const listener = new RabbitMQListener()

listener.listen(Queues.STORE_QUEUE)
