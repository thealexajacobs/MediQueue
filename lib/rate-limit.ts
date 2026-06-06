import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '@/lib/env';

let loginRatelimit: Ratelimit | null = null;
let registerRatelimit: Ratelimit | null = null;

function getRedis() {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export function getLoginRatelimit() {
  if (loginRatelimit) return loginRatelimit;
  const redis = getRedis();
  if (!redis) return null;
  loginRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'ratelimit:login',
  });
  return loginRatelimit;
}

export function getRegisterRatelimit() {
  if (registerRatelimit) return registerRatelimit;
  const redis = getRedis();
  if (!redis) return null;
  registerRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'ratelimit:register',
  });
  return registerRatelimit;
}
