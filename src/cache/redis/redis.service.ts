import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}
  
    public async get(key: string) {
        
        return await this.cacheManager.get(key);
    }

    public async setObject(k: string, v: object) {
        
        await this.cacheManager.set(k, v);
    }

    public async del(k: string) {

        await this.cacheManager.del(k);    
    }
}
