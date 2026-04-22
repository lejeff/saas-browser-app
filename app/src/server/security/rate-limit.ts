type Bucket = { count: number; expiresAt: number };

const buckets = new Map<string, Bucket>();

export function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.expiresAt < now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return;
  }

  if (current.count >= limit) {
    throw new Error("Rate limit exceeded");
  }

  current.count += 1;
  buckets.set(key, current);
}
