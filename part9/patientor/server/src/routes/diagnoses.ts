import express from "express";
import { Diagnosis } from "../types";
import diagnosesData from "../../data/diagnoses";

const router = express.Router();

const diagnoses: Diagnosis[] = diagnosesData;

router.get("/", (_req, res) => {
  res.status(200).json(diagnoses);
});

export default router;
