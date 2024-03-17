import type { AuthRepository } from '$lib/repositories/AuthRepository';

export class SignOutUseCase {
	constructor(private authRepository: AuthRepository) {}

	async execute() {
		return this.authRepository.signOut();
	}
}
