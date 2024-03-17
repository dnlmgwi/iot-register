interface CircularGeofenceRegionOptions {
	name: string;
	latitude: number;
	longitude: number;
	radius: number; // meters
}

interface SquareGeofenceRegionOptions {
	name: string;
	latitude: number;
	longitude: number;
	axis: number; // size of one side of the square
}

export type { CircularGeofenceRegionOptions, SquareGeofenceRegionOptions };
