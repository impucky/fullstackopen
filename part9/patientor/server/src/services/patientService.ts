import patientData from "../../data/patients";
import { Patient, NonSensitivePatientData, NewPatient, Entry, NewEntry } from "../types";
import { v1 as uuid } from "uuid";

let patients: Patient[] = patientData;

const getPatients = (): Patient[] => patients;

const getNonSensitivePatients = (): NonSensitivePatientData[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  return patient;
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patient: Patient, newEntry: NewEntry): Patient => {
  const entry: Entry = { id: uuid(), ...newEntry };
  const updatedPatient = { ...patient, entries: patient.entries.concat(entry) };
  patients = patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p));
  return updatedPatient;
};

export default {
  getPatients,
  getNonSensitivePatients,
  findById,
  addPatient,
  addEntry,
};
