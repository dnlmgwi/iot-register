import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';

export class GetAverageEntryTimeUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string): Promise<Result<string, Error>> {
		return this.userProfileRepository.getAverageEntryTime(userId);
	}
}
