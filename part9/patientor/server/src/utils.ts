import {
  NewPatient,
  Gender,
  NewEntry,
  EntryType,
  Diagnosis,
  HealthCheckRating,
  Discharge,
  SickLeave,
} from "./types";

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error("Incorrect or missing name");
  }
  return name;
};

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error("Incorrect or missing description");
  }
  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist)) {
    throw new Error("Incorrect or missing specialist");
  }
  return specialist;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error("Incorrect or missing ssn");
  }
  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }
  return occupation;
};

const parseCriteria = (criteria: unknown): string => {
  if (!isString(criteria)) {
    throw new Error("Incorrect or missing criteria");
  }
  return criteria;
};

const parseEmployer = (employer: unknown): string => {
  if (!isString(employer)) {
    throw new Error("Incorrect or missing employer");
  }
  return employer;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error("Incorrect date: " + date);
  }
  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect gender: " + gender);
  }
  return gender;
};

const isHealthCheckRating = (param: unknown): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(Number(param));
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (isNaN(Number(rating)) || !isHealthCheckRating(rating)) {
    throw new Error("Incorrect rating: " + rating);
  }
  return rating;
};

const isEntryType = (param: string): param is EntryType => {
  return Object.values(EntryType)
    .map((v) => v.toString())
    .includes(param);
};

const parseType = (type: unknown): EntryType => {
  if (!isString(type) || !isEntryType(type)) {
    throw new Error("Incorrect type: " + type);
  }
  return type;
};

const parseDiagnoses = (codes: unknown): Array<Diagnosis["code"]> => {
  if (!Array.isArray(codes) || !codes.every(isString)) {
    throw new Error("Incorrect or missing diagnoses");
  }
  return codes;
};

const parseDischarge = (object: unknown): Discharge => {
  if (object && typeof object === "object" && "date" in object && "criteria" in object) {
    return {
      date: parseDate(object.date),
      criteria: parseCriteria(object.criteria),
    };
  } else throw new Error("Missing parameters for discharge");
};

const parseSickLeave = (object: unknown): SickLeave => {
  if (object && typeof object === "object" && "startDate" in object && "endDate" in object) {
    return {
      startDate: parseDate(object.startDate),
      endDate: parseDate(object.endDate),
    };
  } else throw new Error("Missing parameters for sick leave");
};

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };

    return newPatient;
  }

  throw new Error("Incorrect data: a field missing");
};

interface BaseEntry {
  type: EntryType;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
  healthCheckRating?: HealthCheckRating;
  discharge?: Discharge;
  sickLeave?: SickLeave;
  employerName?: string;
}

const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if ("type" in object && "description" in object && "date" in object && "specialist" in object) {
    const newEntry: BaseEntry = {
      type: parseType(object.type),
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
    };

    if ("diagnosisCodes" in object) newEntry.diagnosisCodes = parseDiagnoses(object.diagnosisCodes);

    switch (newEntry.type) {
      case EntryType.HealthCheck:
        if ("healthCheckRating" in object) {
          newEntry.healthCheckRating = parseHealthCheckRating(object.healthCheckRating);
        }
        break;
      case EntryType.Hospital:
        if ("discharge" in object) {
          newEntry.discharge = parseDischarge(object.discharge);
        }
        break;
      case EntryType.OccupationalHealthcare:
        if ("sickLeave" in object && "employerName" in object) {
          newEntry.sickLeave = parseSickLeave(object.sickLeave);
          newEntry.employerName = parseEmployer(object.employerName);
        }
        break;
      default:
        break;
    }

    return newEntry as NewEntry;
  }
  throw new Error("Incorrect data for this entry");
};

export default { toNewPatient, toNewEntry };
