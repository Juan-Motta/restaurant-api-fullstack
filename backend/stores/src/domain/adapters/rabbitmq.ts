export class IRabbitMQProducer {
  async publish(queue: string, message: object): Promise<void> {
    throw new Error('Method not implemented.');
  }
}