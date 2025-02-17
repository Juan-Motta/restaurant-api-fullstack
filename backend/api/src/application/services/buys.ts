import { BuyFilter } from '../../domain/filters/buys'
import { IBuysRepository } from '../../domain/repositories/buys'

export class BuysService {
    private buysRepository: IBuysRepository

    constructor(buysRepository: IBuysRepository) {
        this.buysRepository = buysRepository
    }

    public async listAllBuys(filters: BuyFilter) {
        const data = await this.buysRepository.listAll(filters)
        const total = await this.buysRepository.countAll()
        return { data, page: filters.page, perPage: filters.perPage, total }
    }
}
