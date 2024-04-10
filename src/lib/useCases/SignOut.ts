import type { AuthRepository } from '$lib/repositories/AuthRepository';
import type { Result } from '$lib/utils/result';
import type { AuthError } from '@supabase/supabase-js';

export class SignOutUseCase {
	constructor(private authRepository: AuthRepository) {}

	async execute(): Promise<Result<AuthError | null>> {
		return this.authRepository.signOut();
	}
}
