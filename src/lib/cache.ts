// Simple in-memory cache for AI responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 100;

export function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
    }

    return entry.data as T;
}

export function setCache(key: string, data: unknown): void {
    // Evict oldest entries if cache is full
    if (cache.size >= MAX_CACHE_SIZE) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey) cache.delete(oldestKey);
    }

    cache.set(key, { data, timestamp: Date.now() });
}

export function createCacheKey(...parts: string[]): string {
    return parts.join(":").toLowerCase().replace(/\s+/g, "_");
}

// Rate limiting
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10;

export function checkRateLimit(sessionId: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = rateLimits.get(sessionId);

    if (!entry || now > entry.resetAt) {
        rateLimits.set(sessionId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - 1, resetIn: RATE_LIMIT_WINDOW };
    }

    if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
        return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
    }

    entry.count++;
    return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - entry.count, resetIn: entry.resetAt - now };
}
