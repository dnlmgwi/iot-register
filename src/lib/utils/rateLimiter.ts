// src/lib/rateLimiter.ts

const rateLimitWindowMs = 60000; // 1 minute window
const maxRequests = 10; // Max 10 requests per window per client
const clientRequests: Map<string, number[]> = new Map(); // Store client requests timestamps

export function rateLimiter(req: Request): boolean {
	const clientID = req.headers.get('x-forwarded-for') || req.headers.get('host');
	if (!clientID) return false; // Or handle unidentified clients differently

	const now = Date.now();
	if (!clientRequests.has(clientID)) {
		clientRequests.set(clientID, [now]);
		return false;
	}

	const timestamps = clientRequests.get(clientID)!;
	// Filter out requests outside the current window
	const recentTimestamps = timestamps.filter((timestamp) => now - timestamp < rateLimitWindowMs);
	recentTimestamps.push(now);
	clientRequests.set(clientID, recentTimestamps);

	return recentTimestamps.length > maxRequests;
}
