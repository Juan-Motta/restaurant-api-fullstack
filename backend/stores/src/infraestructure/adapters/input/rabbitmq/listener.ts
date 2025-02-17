import amqp from "amqplib";
import { Queues } from "../../../../domain/constants/queues";
import { settings } from "../../../config/settings";
import Logger from "../../../config/logger";
import { Events } from "../../../../domain/constants/events";
import { getStorageService } from "../../../dependencies/services";
import { db } from '../../output/database'
import { CreateOrderMessage } from "../../../../domain/entities/rabbitmq";
import { getEventsLogsRepository } from "../../../dependencies/repositories";
import { EventLogsState } from "../../../../domain/constants/logsStates";

export class RabbitMQListener {

    public async handler(message: CreateOrderMessage){
        if (message.event === Events.CREATE_ORDER) {
            Logger.info(`Preparing ingredients for order ${message.data.orderId}`);
            const client = await db.connect()
            const eventsLogsRepository = await getEventsLogsRepository(client);
            try{
              await eventsLogsRepository.create(Events.CREATE_ORDER, message, EventLogsState.RECEIVED, null);
              const storageService = await getStorageService(client);
              storageService.prepareIngrtedients(message.data.orderId);
            } catch (error) {
              const errorMessage = `Error preparing ingredients: ${error}`;
              await eventsLogsRepository.create(Events.CREATE_ORDER, message, EventLogsState.RECEIVED_FAILED, errorMessage);
            }
            client.release();
        }
    }

    public async listen(queue: string){
        try {
            const connection = await amqp.connect(`amqp://${settings.BROKER_HOST}:${settings.BROKER_PORT}`);

            const channel = await connection.createChannel();
        
            process.once("SIGINT", async () => {
              Logger.info("Closing channel and connection");
              await channel.close();
              await connection.close();
            });
        
            await channel.assertQueue(Queues.STORE_QUEUE, { durable: false });
            await channel.consume(
              queue,
              (message) => {
                  if (message) {
                    Logger.info(`Received message: ${message.content.toString()}`);
                    this.handler(JSON.parse(message.content.toString()));
                }
              },
              { noAck: true }
            );
            Logger.info(`Waiting for messages in queue ${queue}`);
          } catch (err) {
            console.warn(err);
          }
    }
}