import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetAverageEntryTimeUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string) {
		return this.userProfileRepository.getAverageEntryTime(userId);
	}
}
