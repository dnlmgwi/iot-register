import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';

export class DownloadImageUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(path: string): Promise<Result<Blob, Error>> {
		try {
			const url = this.userProfileRepository.downloadImage(path);

			return url;
		} catch (error) {
			throw new Error('Failed to upload profile picture.');
		}
	}
}
