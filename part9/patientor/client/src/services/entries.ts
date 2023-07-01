import axios from "axios";

import { apiBaseUrl } from "../constants";
import { Patient, NewEntry } from "../types";

const create = async (entry: NewEntry, id: string) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients/${id}/entries`, entry);
  return data;
};

export default {
  create,
};
