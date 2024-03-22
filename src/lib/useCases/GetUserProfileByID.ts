import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Profile } from '$lib/entities/Profile';

export class GetUserProfileByIDUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string): Promise<Profile> {
		try {
			const profile = await this.userProfileRepository.getUserProfileByStudentID(userId);

			return profile;
		} catch (error) {
			// Re-throw the error to be handled by the caller
			throw new Error('Profile Incomplete');
		}
	}
}
