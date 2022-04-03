/* eslint-disable prettier/prettier */
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
        store: redisStore,
        socket: {
          host: 'localhost',
          port: 6379,
        },
    }),
  ],
  providers: [RedisService]
})
export class RedisModule {}
