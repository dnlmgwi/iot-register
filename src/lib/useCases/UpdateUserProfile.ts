import type { ProfileValueObject } from '$lib/ValueObjects/Profile';
import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class UpdateUserProfileUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(profile: ProfileValueObject): Promise<Error | null> {
		return this.userProfileRepository.updateUserProfile(profile);
	}
}


