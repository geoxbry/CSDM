export interface Zone {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

export interface GameObject {
  id: number;
  name: string;
  objectType: string;
  correctZoneId: number;
  errorMessage: string;
  successMessage: string;
  points: number;
}

export interface Scenario {
  id: number;
  name: string;
  customerName: string;
  description: string;
  zoneIds: number[];
  objectIds: number[];
}

export interface Placement {
  objectId: number;
  zoneId: number;
}

export interface ValidationResult {
  objectId: number;
  correct: boolean;
  message: string;
}
