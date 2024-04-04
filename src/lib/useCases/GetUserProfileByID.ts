import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Profile } from '$lib/entities/Profile';

export class GetUserProfileByIDUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string): Promise<Profile> {
		const profile = await this.userProfileRepository.getUserProfileByStudentID(userId);

		return profile;
	}
}
