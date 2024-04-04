import type { AttendanceData } from '$lib/entities/Student';

// Function to add a rating based on attendance
export function addAttendanceRating(data: AttendanceData[]) {
	const totalDays = 12;
	const requiredAttendanceGood = Math.ceil(totalDays * 0.75); // 75% of total days
	const requiredAttendanceOk = Math.ceil(totalDays * 0.5); // 50% of total days

	return data.map((student) => ({
		...student,
		rating:
			student.count >= requiredAttendanceGood
				? 'Good'
				: student.count >= requiredAttendanceOk
					? 'Ok'
					: 'Poor'
	}));
}
