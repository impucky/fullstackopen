export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
}

export enum Gender {
  Female = "female",
  Male = "male",
  Other = "other",
}

export type NonSensitivePatientData = Omit<Patient, "ssn">;

export type NewPatient = Omit<Patient, "id">;
