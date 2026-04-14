export interface Trip { id: string; routeId: string; vehicleId: string; departureTime: string; arrivalTime: string; status: TripStatus; availableSeats: number; bookedSeats: number; pricePerSeat: number; driver: Driver; createdAt: string; updatedAt: string; }

export interface Driver { id: string; name: string; licenseNumber: string; phone: string; email: string; rating: number; }

export enum TripStatus { SCHEDULED = "scheduled", IN_PROGRESS = "in_progress", COMPLETED = "completed", CANCELLED = "cancelled", DELAYED = "delayed" }