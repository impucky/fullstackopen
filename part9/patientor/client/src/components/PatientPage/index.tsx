import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Box, Typography } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

import EntryDetails from "./EntryDetails";
import { Patient, Entry, Diagnosis } from "../../types";
import patientService from "../../services/patients";
import diagnosesService from "../../services/diagnoses";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();
  const [error, setError] = useState<string | undefined>("");

  const { id = "" } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patient = await patientService.getOne(id);
        setPatient(patient);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error?.response?.data && typeof error?.response?.data === "string") {
            const message = error.response.data.replace("Something went wrong. Error: ", "");
            console.error(message);
            setError(message);
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", error);
          setError("Unknown error");
        }
      }
    };

    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    };

    fetchPatient();
    fetchDiagnoses();
  }, []);

  if (!patient || !diagnoses) {
    return (
      <Typography align="center" variant="h6">
        {error && `Error: ${error}`}
      </Typography>
    );
  }

  return (
    <Box mt={3}>
      <Typography variant="h6">
        Patient: {patient.name}
        {patient.gender === "female" && <FemaleIcon />}
        {patient.gender === "male" && <MaleIcon />}
      </Typography>
      <Typography variant="body1">
        <b>SSN:</b> {patient.ssn}
      </Typography>
      <Typography variant="body1">
        <b>Occupation:</b> {patient.occupation}
      </Typography>
      {patient.entries.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6">Entries</Typography>
          {patient.entries.map((entry: Entry) => {
            return <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />;
          })}
        </Box>
      )}
    </Box>
  );
};
export default PatientPage;
