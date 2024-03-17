import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetTotalAttendanceAndGroupByDay {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(userId: string) {
		return this.userProfileRepository.GetAttendanceAndGroupByDate(userId);
	}
}
