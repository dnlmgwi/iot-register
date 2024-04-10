import type { Result } from '$lib/utils/result';
import type { AuthError, SupabaseClient } from '@supabase/supabase-js';

export class AuthRepository {
	constructor(private supabase: SupabaseClient) {}

	async signOut(): Promise<Result<AuthError | null>> {
		const { error } = await this.supabase.auth.signOut();

		if (error) {
			throw new Error(error.message);
		}

		return { kind: 'success', data: null };
	}
}
