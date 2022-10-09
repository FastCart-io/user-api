import { Logger, Module, CacheModule, OnModuleInit, Inject, CACHE_MANAGER } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Cache } from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    providers: [RedisService],
    imports: [

        CacheModule.registerAsync({
            useFactory: async () => {
            
                return {
                    isGlobal: true,
                    store: redisStore,
                    host: 'localhost',
                    port: 6380,
                    ttl: 60 * 3600 * 1000,
                    no_ready_check: true
                }
            }
        }),
    ],
    exports: [
        CacheModule,
        RedisService
    ]
})

export class RedisModule implements OnModuleInit {

    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}

    public onModuleInit() {
        const logger = new Logger('Cache')
    }
}
