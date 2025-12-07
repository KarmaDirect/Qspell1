import { Redis } from '@upstash/redis'

let redis: Redis | null = null

if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  })
}

// Cache helper functions
export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    const cached = await redis.get(key)
    return cached as T | null
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function setCache(
  key: string,
  value: unknown,
  expirationSeconds: number
): Promise<void> {
  if (!redis) return
  try {
    await redis.setex(key, expirationSeconds, JSON.stringify(value))
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (!redis) return
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Redis delete error:', error)
  }
}

