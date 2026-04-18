import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'

// Lazily initialize the Neon client so builds do not fail when DRIZZLE_DB_URL
// is not set. At runtime, if the env var is missing and DB operations are
// attempted, the proxy will throw a clear error.

let dbInstance;

if (process.env.DRIZZLE_DB_URL) {
	try {
		const sql = neon(process.env.DRIZZLE_DB_URL);
		dbInstance = drizzle(sql, { schema });
	} catch (err) {
		console.error('Failed to initialize neon DB client. Check DRIZZLE_DB_URL:', err?.message || err);
		throw err;
	}
} else {
	console.warn('Warning: DRIZZLE_DB_URL is not set. Database operations will fail at runtime.');

	const makeThrowingProxy = () => {
		const err = new Error('DRIZZLE_DB_URL is not set. Set DRIZZLE_DB_URL to enable database operations.');
		const handler = {
			get() {
				return new Proxy(() => { throw err; }, handler);
			},
			apply() {
				throw err;
			},
			construct() {
				throw err;
			},
		};
		return new Proxy(() => { throw err; }, handler);
	};

	dbInstance = makeThrowingProxy();
}

export const db = dbInstance;


