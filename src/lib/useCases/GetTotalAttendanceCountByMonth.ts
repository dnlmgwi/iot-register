import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';
import type { MonthlyAttendance } from '$lib/ValueObjects/MonthlyAttendance';

export class GetTotalAttendanceCountByMonthUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(student_id: string): Promise<Result<MonthlyAttendance[], Error>> {
		return this.userProfileRepository.getTotalAttendancePerMonth(student_id);
	}
}
