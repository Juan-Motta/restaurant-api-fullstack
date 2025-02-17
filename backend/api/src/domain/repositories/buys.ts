import { Buy } from '../entities/buys'
import { BuyFilter } from '../filters/buys'

export class IBuysRepository {
    async countAll(): Promise<number> {
        throw new Error('Method not implemented.')
    }

    async listAll(filters: BuyFilter): Promise<Buy[]> {
        throw new Error('Method not implemented.')
    }
}
