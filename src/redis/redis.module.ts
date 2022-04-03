/* eslint-disable prettier/prettier */

import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async() => ({
        store: redisStore,
        host: 'localhost',
        port: 6379
      })
    }),
  ],
  providers: [RedisService]
})
export class RedisModule {}
