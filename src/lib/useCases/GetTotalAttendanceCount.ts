import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetTotalAttendanceCount {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string) {
		return this.userProfileRepository.GetTotalAttendanceCount(userId);
	}
}
