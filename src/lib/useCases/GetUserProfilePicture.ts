import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class DownloadImageUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(path: string): Promise<Blob> {
		try {
			const url = this.userProfileRepository.downloadImage(path);

			return url;
		} catch (error) {
			throw new Error('Failed to upload profile picture.');
		}
	}
}
