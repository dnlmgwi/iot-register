import type { AuthError, SupabaseClient } from '@supabase/supabase-js';

export class AuthRepository {
	constructor(private supabase: SupabaseClient) {}

	async signOut(): Promise<AuthError | null> {
		const { error } = await this.supabase.auth.signOut();

		if (error) {
			throw new Error(error.message);
		}

		return error;
	}
}
