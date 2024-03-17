import type { CircularGeofenceRegionOptions } from '$lib/ValueObjects/GeofenceRegionOptions';

class CircularGeofenceRegion {
	name!: string;
	latitude!: number;
	longitude!: number;
	radius!: number;

	constructor(opts: CircularGeofenceRegionOptions) {
		Object.assign(this, opts);
	}

	inside(lat2: number, lon2: number): boolean {
		const lat1 = this.latitude;
		const lon1 = this.longitude;
		const R = 6371e3; // Earth's radius in meters

		const phi1 = (lat1 * Math.PI) / 180; // φ, λ in radians
		const phi2 = (lat2 * Math.PI) / 180;
		const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

		// Using Haversine formula
		const distance =
			Math.acos(
				Math.sin(phi1) * Math.sin(phi2) + Math.cos(phi1) * Math.cos(phi2) * Math.cos(deltaLambda)
			) * R;

		return distance < this.radius;
	}
}

// class SquareGeofenceRegion {
// 	name: string;
// 	latitude: number;
// 	longitude: number;
// 	axis: number;

// 	constructor(opts: SquareGeofenceRegionOptions) {
// 		Object.assign(this, opts);
// 	}

// 	inside(lat: number, lon: number): boolean {
// 		const x = this.latitude;
// 		const y = this.longitude;
// 		const { axis } = this;

// 		return lat > x - axis && lat < x + axis && lon > y - axis && lon < y + axis;
// 	}
// }

const DiplomaClass = new CircularGeofenceRegion({
	name: 'NACIT Resource Room',
	latitude: -13.9739966,
	longitude: 33.7707999,
	radius: 4 // meters
});

export { DiplomaClass };
