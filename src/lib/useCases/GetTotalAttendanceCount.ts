import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';

export class GetTotalAttendanceCountUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string): Promise<Result<number, Error>> {
		return this.userProfileRepository.getTotalAttendanceCount(userId);
	}
}
