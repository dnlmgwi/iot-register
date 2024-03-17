import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetTotalAttendanceCountByMonthUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(student_id: string) {
		return this.userProfileRepository.getTotalAttendancePerMonth(student_id);
	}
}
