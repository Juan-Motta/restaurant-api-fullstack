import { IngredientFilter } from '../../domain/filters/ingredients'
import { IStorageRepository } from '../../domain/repositories/storages'

export class StorageService {
    private storageRepository: IStorageRepository

    constructor(storageRepository: IStorageRepository) {
        this.storageRepository = storageRepository
    }

    public async getAllIngredients(filters: IngredientFilter) {
        const data = await this.storageRepository.getAllIngredients(filters)
        const total = await this.storageRepository.countAll()
        return { data, page: filters.page, perPage: filters.perPage, total }
    }
}
