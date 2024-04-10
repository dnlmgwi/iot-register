import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Profile } from '$lib/entities/Profile';
import type { Result } from '$lib/utils/result';

export class GetUserProfileUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string): Promise<Result<Profile, Error>> {
		return await this.userProfileRepository.getUserProfile(userId);
	}
}
