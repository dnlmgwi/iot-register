import type { AttendanceData } from '$lib/entities/Student';
import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetAttendanceCountTop15UseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(): Promise<AttendanceData[]> {
		return this.userProfileRepository.getAttendanceCountTop15();
	}
}
