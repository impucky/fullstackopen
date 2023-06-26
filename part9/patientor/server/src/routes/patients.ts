import express from "express";
import { Patient, NonSensitivePatientData } from "../types";
import patientData from "../../data/patients";
const router = express.Router();

const patients: Patient[] = patientData;

//const getPatients = (): Patient[] => patients;

const getNonSensitivePatientData = (): NonSensitivePatientData[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

router.get("/", (_req, res) => {
  res.status(200).json(getNonSensitivePatientData());
});

export default router;
