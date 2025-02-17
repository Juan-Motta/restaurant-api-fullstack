import { IBuysRepository } from '../../domain/repositories/buys'

export class BuysService {
    private buysRepository: IBuysRepository

    constructor(buysRepository: IBuysRepository) {
        this.buysRepository = buysRepository
    }

    public listAllBuys() {
        return this.buysRepository.listAll()
    }
}
