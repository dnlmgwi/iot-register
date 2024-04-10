import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';

export class UploadProfilePictureUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string, file: File): Promise<Result<string, Error>> {
		try {
			const path = await this.userProfileRepository.uploadProfilePicture(userId, file);

			return path;
		} catch (error) {
			// Re-throw the error to be handled by the caller
			throw new Error('Upload Failed');
		}
	}
}
