import { getRabbitMQProducer, getHttpAdapter } from '../../../src/infraestructure/dependencies/utils';
import { RabbitMQProducer } from '../../../src/infraestructure/adapters/output/rabbitmq/producer';
import { HttpAdapter } from '../../../src/infraestructure/adapters/output/http/request';

describe('Adapter Factory Functions', () => {
    it('should return an instance of RabbitMQProducer', async () => {
        const rabbitMQProducer = await getRabbitMQProducer();
        expect(rabbitMQProducer).toBeInstanceOf(RabbitMQProducer);
    });

    it('should return an instance of HttpAdapter', async () => {
        const httpAdapter = await getHttpAdapter();
        expect(httpAdapter).toBeInstanceOf(HttpAdapter);
    });
});