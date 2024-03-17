interface RegisterRow {
	created_at: string;
}

// Define a type for the function's return value.
interface MonthlyAttendance {
	Month: string;
	AttendanceCount: number;
}

export type { MonthlyAttendance, RegisterRow };
