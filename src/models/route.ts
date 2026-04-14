/** 
 * Represents a transport route model.
 * @interface TransportRoute
 */
interface TransportRoute {
    /** The unique identifier for the route */
    id: string;
    /** The name of the route */
    name: string;
    /** List of stops in the route */
    stops: Stop[];
    /** Schedule information for the route */
    schedule: Schedule;
    /** Information about the trip */
    tripInfo: TripInfo;
}

/**
 * Represents a stop in the transport route.
 * @interface Stop
 */
interface Stop {
    /** The name of the stop */
    name: string;
    /** The sequence number of the stop in the route */
    sequence: number;
    /** The location of the stop */
    location: Location;
}

/**
 * Represents the location with latitude and longitude.
 * @interface Location
 */
interface Location {
    /** Latitude of the location */
    latitude: number;
    /** Longitude of the location */
    longitude: number;
}

/**
 * Represents the schedule for a transport route.
 * @interface Schedule
 */
interface Schedule {
    /** The start time of the route */
    startTime: string; // Format: HH:mm
    /** The end time of the route */
    endTime: string; // Format: HH:mm
    /** Frequency of the route */
    frequency: string; // e.g., "30 minutes"
}

/**
 * Represents trip information for the transport route.
 * @interface TripInfo
 */
interface TripInfo {
    /** Total distance of the trip in kilometers */
    totalDistance: number;
    /** Estimated duration of the trip in minutes */
    estimatedDuration: number;
}