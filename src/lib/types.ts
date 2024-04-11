import type { MonthlyAttendance } from './ValueObjects/MonthlyAttendance';

export interface AttendanceStats {
	attendanceCount: number;
	attendanceAvgEntryTime: string;
	attendanceCountByMonth: MonthlyAttendance[];
}
