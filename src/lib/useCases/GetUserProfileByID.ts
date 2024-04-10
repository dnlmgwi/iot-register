import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Profile } from '$lib/entities/Profile';
import type { Result } from '$lib/utils/result';

export class GetUserProfileByIDUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string): Promise<Result<Profile, Error>> {
		const profile = await this.userProfileRepository.getUserProfileByStudentID(userId);

		return profile;
	}
}
