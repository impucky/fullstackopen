import { List, ListItemText, Typography, Card } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";

import { Entry, Diagnosis } from "../../types";
import HealthRatingBar from "../HealthRatingBar";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry, diagnoses }: { entry: Entry; diagnoses: Diagnosis[] }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <Card sx={{ p: 2, my: 2 }}>
          <Typography>
            <MedicalServicesIcon />
            {entry.date}
          </Typography>
          <Typography>
            <i>{entry.description}</i>
          </Typography>
          {entry.diagnosisCodes && (
            <List>
              {entry.diagnosisCodes.map((dcode: Diagnosis["code"]) => {
                const diagnosis = diagnoses.find((d: Diagnosis) => d.code === dcode);
                return (
                  <ListItemText key={dcode}>
                    <b>{dcode}:</b> {diagnosis && diagnosis.name}
                  </ListItemText>
                );
              })}
            </List>
          )}
          <Typography>
            Discharged {entry.discharge.date} ({entry.discharge.criteria})
          </Typography>
          <Typography>Diagnosed by {entry.specialist}</Typography>
        </Card>
      );
    case "OccupationalHealthcare":
      return (
        <Card sx={{ p: 2, my: 2 }}>
          <Typography>
            <WorkIcon />
            {entry.date}
          </Typography>
          <Typography>
            <i>{entry.description}</i>
          </Typography>
          {entry.diagnosisCodes && (
            <List>
              {entry.diagnosisCodes.map((dcode: Diagnosis["code"]) => {
                const diagnosis = diagnoses.find((d: Diagnosis) => d.code === dcode);
                return (
                  <ListItemText key={dcode}>
                    <b>{dcode}:</b> {diagnosis && diagnosis.name}
                  </ListItemText>
                );
              })}
            </List>
          )}
          <Typography>Employer: {entry.employerName}</Typography>
          {entry.sickLeave && (
            <Typography>
              On leave: {entry.sickLeave.startDate} -&gt; {entry.sickLeave.endDate}
            </Typography>
          )}
          <Typography>Diagnosed by {entry.specialist}</Typography>
        </Card>
      );
    case "HealthCheck":
      return (
        <Card sx={{ p: 2, my: 2 }}>
          <Typography>
            <MonitorHeartIcon />
            {entry.date}
          </Typography>
          <Typography>
            <i>{entry.description}</i>
          </Typography>
          {entry.diagnosisCodes && (
            <List>
              {entry.diagnosisCodes.map((dcode: Diagnosis["code"]) => {
                const diagnosis = diagnoses.find((d: Diagnosis) => d.code === dcode);
                return (
                  <ListItemText key={dcode}>
                    <b>{dcode}:</b> {diagnosis && diagnosis.name}
                  </ListItemText>
                );
              })}
            </List>
          )}
          <HealthRatingBar showText={false} rating={entry.healthCheckRating} />
          <Typography>Diagnosed by {entry.specialist}</Typography>
        </Card>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
