import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class UploadProfilePictureUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string, file: File): Promise<string> {
		try {
			const path = await this.userProfileRepository.uploadProfilePicture(userId, file);

			return path;
		} catch (error) {
			// Optionally, log the error or transform it into a more specific error type here
			console.error('Upload Profile Picture Error:', error);

			// Re-throw the error to be handled by the caller
			throw new Error('Failed to upload profile picture.');
		}
	}
}
