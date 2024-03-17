import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetPublicUrlUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(path: string): Promise<string> {
		try {
			const url = await this.userProfileRepository.getPublicUrl(path);

			return url;
		} catch (error) {
			// Optionally, log the error or transform it into a more specific error type here
			console.error('Upload Profile Picture Error:', error);

			// Re-throw the error to be handled by the caller
			throw new Error('Failed to upload profile picture.');
		}
	}
}
