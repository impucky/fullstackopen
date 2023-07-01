import { useState, SyntheticEvent, Dispatch, SetStateAction } from "react";
import axios from "axios";

import {
  TextField,
  Divider,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Add, Delete, MedicalServices, MonitorHeart, Work } from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

import entryService from "../../services/entries";
import { NewEntry, EntryType, HealthCheckRating, Diagnosis, Patient } from "../../types";

const AddEntryForm = ({
  diagnoses,
  patient,
  setPatient,
}: {
  diagnoses: Diagnosis[];
  patient: Patient;
  setPatient: Dispatch<SetStateAction<Patient | undefined>>;
}) => {
  const [open, setOpen] = useState(false);
  const [diagnosesOpen, setDiagnosesOpen] = useState(false);
  const [error, setError] = useState<string>();

  const [type, setType] = useState<EntryType>(EntryType.Hospital);
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [entryDiagnoses, setEntryDiagnoses] = useState<string[]>([]);

  // Hospital
  const [dischargeDate, setDischargeDate] = useState<Dayjs | null>(dayjs());
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  // Occupational
  const [employer, setEmployer] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState<Dayjs | null>(dayjs());
  const [sickLeaveEnd, setSickLeaveEnd] = useState<Dayjs | null>(dayjs());
  // Healthcheck
  const [healthRating, setHealthRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleDiagToggle = () => setDiagnosesOpen(!diagnosesOpen);

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const type = Object.values(EntryType).find((g) => g.toString() === value);
      if (type) {
        setType(type);
        resetForm();
      }
    }
  };

  const onHealthRatingChange = (event: SelectChangeEvent<number>) => {
    event.preventDefault();
    if (typeof event.target.value === "number") {
      setHealthRating(event.target.value);
    }
  };

  const resetForm = () => {
    const date = dayjs();
    setDescription("");
    setSpecialist("");
    setDate(date);
    setEntryDiagnoses([]);
    setDischargeDate(date);
    setDischargeCriteria("");
    setEmployer("");
    setSickLeaveStart(date);
    setSickLeaveEnd(date);
    setHealthRating(HealthCheckRating.Healthy);
  };

  const addDiagnosis = (dcode: string) => {
    setEntryDiagnoses(entryDiagnoses.concat(dcode));
    handleDiagToggle();
  };

  const submitEntry = async (event: SyntheticEvent) => {
    event.preventDefault();
    const entry = {
      date: date?.format("YYYY-MM-DD"),
      type,
      specialist,
      ...(entryDiagnoses.length > 0 && { diagnosisCodes: entryDiagnoses }),
      description,
      ...(type === "Hospital" && {
        discharge: { date: dischargeDate?.format("YYYY-MM-DD"), criteria: dischargeCriteria },
      }),
      ...(type === "OccupationalHealthcare" && {
        employer,
        sickLeave: {
          start: sickLeaveStart?.format("YYYY-MM-DD"),
          end: sickLeaveEnd?.format("YYYY-MM-DD"),
        },
      }),
      ...(type === "HealthCheck" && { healthCheckRating: healthRating }),
    } as NewEntry;
    try {
      const updatedPatient = await entryService.create(entry, patient.id);
      setPatient(updatedPatient);
      handleClose();
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

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Add a new entry
      </Button>
      <Dialog fullWidth={true} open={open} onClose={handleClose}>
        <DialogTitle>New entry</DialogTitle>
        <Divider />
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={submitEntry}>
            <InputLabel style={{ marginTop: 20 }}>Entry Type</InputLabel>
            <Select fullWidth value={type} onChange={onTypeChange}>
              <MenuItem value={EntryType.Hospital}>
                <MedicalServices />
                Hospital Admission
              </MenuItem>
              <MenuItem value={EntryType.HealthCheck}>
                <MonitorHeart />
                Health Check
              </MenuItem>
              <MenuItem value={EntryType.OccupationalHealthcare}>
                <Work />
                Occupational Healthcare
              </MenuItem>
            </Select>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ margin: "0.7rem 0", width: "100%" }}
                label="Date"
                value={date}
                onChange={(value) => setDate(value)}
              />
            </LocalizationProvider>
            <TextField
              label="Description"
              value={description}
              onChange={({ target }) => setDescription(target.value)}
              multiline
              required
              fullWidth
            />
            <TextField
              sx={{ margin: "0.7rem 0" }}
              label="Specialist"
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
              required
              fullWidth
            />
            <InputLabel>
              Diagnosis Codes{" "}
              <Button variant="contained" size="small" onClick={handleDiagToggle}>
                Add <Add />
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => setEntryDiagnoses([])}
              >
                Clear All <Delete />
              </Button>
            </InputLabel>
            <Typography>{entryDiagnoses.join(", ")}</Typography>
            <Dialog open={diagnosesOpen} onClose={handleDiagToggle}>
              {diagnoses.map((d) => {
                const isSelected = entryDiagnoses.some((entryDiag) => entryDiag === d.code);
                if (!isSelected) {
                  return (
                    <Button
                      key={d.code}
                      value={d.code}
                      onClick={() => addDiagnosis(d.code)}
                      color={isSelected ? "error" : "primary"}
                    >
                      {d.code} - {d.name} <Add />
                    </Button>
                  );
                }
              })}
            </Dialog>
            <Divider sx={{ margin: "0.7rem 0" }} />
            {type === EntryType.Hospital && (
              <>
                <InputLabel>Discharge</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ margin: "0.7rem 0", width: "100%" }}
                    label="Date"
                    value={dischargeDate}
                    onChange={(value) => setDischargeDate(value)}
                  />
                </LocalizationProvider>
                <TextField
                  label="Criteria"
                  value={dischargeCriteria}
                  onChange={({ target }) => setDischargeCriteria(target.value)}
                  multiline
                  required
                  fullWidth
                />
              </>
            )}
            {type === EntryType.OccupationalHealthcare && (
              <>
                <TextField
                  sx={{ margin: "0.7rem 0" }}
                  label="Employer"
                  value={employer}
                  onChange={({ target }) => setEmployer(target.value)}
                  required
                  fullWidth
                />
                <InputLabel>Sick leave</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ margin: "0.7rem 0", width: "100%" }}
                    label="Start"
                    value={sickLeaveStart}
                    onChange={(value) => setSickLeaveStart(value)}
                  />
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="End"
                    value={sickLeaveEnd}
                    onChange={(value) => setSickLeaveEnd(value)}
                  />
                </LocalizationProvider>
              </>
            )}
            {type === EntryType.HealthCheck && (
              <>
                <InputLabel>Health rating</InputLabel>
                <Select value={healthRating} onChange={onHealthRatingChange} fullWidth>
                  <MenuItem value={HealthCheckRating.Healthy}>0 - Healthy</MenuItem>
                  <MenuItem value={HealthCheckRating.LowRisk}>1 - Low Risk</MenuItem>
                  <MenuItem value={HealthCheckRating.HighRisk}>2 - High Risk</MenuItem>
                  <MenuItem value={HealthCheckRating.CriticalRisk}>3 - Critical Risk</MenuItem>
                </Select>
              </>
            )}
            <Button type="submit" variant="contained">
              Add
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddEntryForm;

// "Healthy" = 0,
// "LowRisk" = 1,
// "HighRisk" = 2,
// "CriticalRisk" = 3,
