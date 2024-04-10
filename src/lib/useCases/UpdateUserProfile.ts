import type { ProfileValueObject } from '$lib/ValueObjects/Profile';
import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';

export class UpdateUserProfileUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(profile: ProfileValueObject): Promise<Result<null, Error>> {
		return this.userProfileRepository.updateUserProfile(profile);
	}
}


