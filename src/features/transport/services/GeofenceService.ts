interface Location {
  lat: number;
  lng: number;
}

interface GeofenceZone {
  id: string;
  name: string;
  center: Location;
  radius: number; // roughly in generic coordinate units for demo
}

const GEOFENCE_ZONES: GeofenceZone[] = [
  {
    id: 'zone-annanagar',
    name: 'Annanagar Stop',
    center: { lat: 40, lng: 40 }, // Using simple coordinate space matching our tracker
    radius: 6, // Distance threshold
  }
];

// Track which buses have already triggered the alert to avoid spamming
const alertedBuses = new Set<string>();

export const checkGeofence = (busId: string, currentLoc: Location): { entered: boolean; stopName?: string } => {
  for (const zone of GEOFENCE_ZONES) {
    // Simple Euclidean distance for demo instead of Haversine
    const dx = currentLoc.lng - zone.center.lng;
    const dy = currentLoc.lat - zone.center.lat;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= zone.radius) {
      const alertKey = `${busId}-${zone.id}`;
      if (!alertedBuses.has(alertKey)) {
        alertedBuses.add(alertKey);
        return { entered: true, stopName: zone.name };
      }
    }
  }
  
  return { entered: false };
};
