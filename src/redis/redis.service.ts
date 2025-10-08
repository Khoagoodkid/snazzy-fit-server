import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly logger = new Logger(RedisService.name);
    private redisClient: Redis | null = null;
    public isEnabled: boolean;

    constructor() {
        this.isEnabled = process.env.REDIS_ENABLED === 'true';

        if (this.isEnabled) {
            console.log('Redis is enabled');
            try {
                const redisUrl = process.env.REDIS_URL;
                console.log('Redis URL:', redisUrl);
                this.redisClient = redisUrl
                    ? new Redis(redisUrl)
                    : new Redis({
                        host: process.env.REDIS_HOST || 'localhost',
                        port: parseInt(process.env.REDIS_PORT || '6379', 10),
                        password: process.env.REDIS_PASSWORD || undefined,
                        db: parseInt(process.env.REDIS_DB || '0', 10),
                    });

                this.redisClient.on('connect', () =>
                    this.logger.log('Connected to Redis'),
                );
                this.redisClient.on('error', (error) =>
                    this.logger.error('Redis error:', error.message),
                );
            } catch (error) {
                this.logger.error('Failed to initialize Redis:', error.message);
                this.isEnabled = false;
                this.redisClient = null;
            }
        } else {
            this.logger.warn('Redis is disabled (REDIS_ENABLED is not set to true)');
        }
    }

    getClient(): Redis {
        if (!this.redisClient) {
            throw new Error('Redis client not initialized');
        }
        return this.redisClient;
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
        if (!this.isEnabled || !this.redisClient) return false;
        console.log('Setting key:', key);
        try {
            const result = ttlSeconds
                ? await this.redisClient.set(key, value, 'EX', ttlSeconds)
                : await this.redisClient.set(key, value);
            return result === 'OK';
        } catch (error) {
            this.logger.error('Failed to set key:', error.message);
            return false;
        }
    }

    async get(key: string): Promise<string | null> {
        if (!this.isEnabled || !this.redisClient) return null;
        console.log('Getting key:', key);
        try {
            return await this.redisClient.get(key);
        } catch (error) {
            console.log('Failed to get key:', error.message);
            this.logger.error('Failed to get key:', error.message);
            return null;
        }
    }
}
