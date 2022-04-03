/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        ) {}

    async setObject(key, data): Promise<any> {
        await this.cacheManager.set(key, data, { ttl: 30 * 60 });
    }

    async deleteObject(key): Promise<any> {
        return await this.cacheManager.del(key);
    }

    async getObject(key): Promise<any> {
        return await this.cacheManager.get(key);
    }

    async setQuery(key, queryParams, data): Promise<any> {
        const query = queryParams._parsedUrl.query
        await this.cacheManager.set(key + '_query_' + query, data, { ttl: 30 * 60 });
    }

    async getQuery(key, queryParams): Promise<any> {
        const query = queryParams._parsedUrl.query
        await this.cacheManager.get(key + '_query_' + query);
    }

    async deleteQuery(key): Promise<any> {
        const cache = await this.cacheManager.store;
        const keys = await cache.keys(key + '_query_*')
        await this.cacheManager.del(keys)
    }
}
