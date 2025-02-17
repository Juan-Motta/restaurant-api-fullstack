import { IStorageRepository } from '../../domain/repositories/storages'

export class StorageService {
    private storageRepository: IStorageRepository

    constructor(storageRepository: IStorageRepository) {
        this.storageRepository = storageRepository
    }

    public async getAllIngredients() {
        return this.storageRepository.getAllIngredients()
    }
}
