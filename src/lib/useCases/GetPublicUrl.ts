import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';

export class GetPublicUrlUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(path: string): Promise<Result<string, Error>> {
		try {
			const url = await this.userProfileRepository.getPublicUrl(path);

			return url;
		} catch (error) {
			// Re-throw the error to be handled by the caller
			throw new Error('Failed to upload profile picture.');
		}
	}
}
