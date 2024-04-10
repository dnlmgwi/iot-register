import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';

export class RegisterStudentUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(student_id: string, device_id: string): Promise<Result<string, Error>> {
		return this.userProfileRepository.registerStudent(student_id, device_id);
	}
}
