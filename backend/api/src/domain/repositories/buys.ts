import { Buy } from '../entities/buys'

export class IBuysRepository {
    listAll(): Promise<Buy[]> {
        throw new Error('Method not implemented.')
    }
}
