import express from "express";
const router = express.Router();

import { Diagnosis } from "../types";
import diagnosesData from "../../data/diagnoses";

const diagnoses: Diagnosis[] = diagnosesData;

router.get("/", (_req, res) => {
  res.status(200).json(diagnoses);
});

export default router;
