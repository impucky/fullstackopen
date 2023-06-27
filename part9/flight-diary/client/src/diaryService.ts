import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "./types";

const baseUrl = "http://localhost:3001/api";

const getEntries = () => {
  return axios.get<DiaryEntry[]>(`${baseUrl}/diaries`).then((res) => res.data);
};

const createNew = (entry: NewDiaryEntry) => {
  return axios.post(`${baseUrl}/diaries`, entry).then((res) => res.data);
};

export default {
  getEntries,
  createNew,
};
