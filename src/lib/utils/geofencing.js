class CircularGeofenceRegion {
  constructor(opts) {
    Object.assign(this, opts)
  }

  inside(lat2, lon2) {
    const lat1 = this.latitude
    const lon1 = this.longitude
    const R = 63710; // Earth's radius in m

    return Math.acos(Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.cos(lon2 - lon1)) * R < this.radius;
  }
}

class SquareGeofenceRegion {
  constructor(opts) {
    Object.assign(this, opts)
  }

  inside(lat, lon) {
    const x = this.latitude
    const y = this.longitude
    const { axis } = this

    return lat > (x - axis) &&
      lat < (x + axis) &&
      lon > (y - axis) &&
      lon < (y + axis)
  }
}

export const DiplomaClass = new CircularGeofenceRegion({
  name: 'NACIT Lilongwe, Diploma',
  latitude: -13.9736485,
  longitude: 33.7711613,
  radius: 8 // meters
});

export const DiplomaLab1Class = new CircularGeofenceRegion({
  name: 'NACIT Lilongwe, Computer Lab',
  latitude: -13.9736485,
  longitude: 33.7711613,
  radius: 5 // meters
});

// const fenceB = new SquareGeofenceRegion({
//   name: 'myfence',
//   latitude: 59.345635,
//   longitude: 18.059707,
//   axis: 1000 // meters in all 4 directions
// })

