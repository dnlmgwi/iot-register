import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class RegisterStudentUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(student_id: string, device_id: string): Promise<void> {
		return this.userProfileRepository.registerStudent(student_id, device_id);
	}
}
