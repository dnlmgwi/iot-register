import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetTotalAttendanceCountUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string) {
		return this.userProfileRepository.getTotalAttendanceCount(userId);
	}
}
