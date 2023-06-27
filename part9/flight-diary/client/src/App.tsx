import { useState, useEffect } from "react";
import diaryService from "./diaryService";
import { DiaryEntry, Weather, Visibility } from "./types";

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    diaryService.getEntries().then((data) => setEntries(data));
  }, []);

  return (
    <>
      <NewEntryForm entries={entries} setEntries={setEntries} />
      <h1>Flight Diary</h1>
      {entries.length > 0 && entries.map((e) => <Entry key={e.id} data={e} />)}
    </>
  );
};

const Entry = ({ data }: { data: DiaryEntry }) => {
  return (
    <div
      style={{
        padding: "0.5rem",
        margin: "0.5rem 0",
        border: "1px solid #bbb",
      }}
    >
      <h2>{data.date}</h2>
      <p>
        <b>Weather:</b> {data.weather}
      </p>
      <p>
        <b>Visibility:</b> {data.visibility}
      </p>
      <p>{data.comment}</p>
    </div>
  );
};

interface FormProps {
  entries: DiaryEntry[];
  setEntries: (e: DiaryEntry[]) => void;
}

const NewEntryForm = ({ entries, setEntries }: FormProps) => {
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState("");

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    diaryService.createNew({ date, visibility, weather, comment }).then((res) => {
      setEntries(entries.concat(res));
    });
  };

  return (
    <div
      style={{
        padding: "0.5rem",
        margin: "0.5rem 0",
      }}
    >
      <h2>New entry</h2>
      <form onSubmit={onSubmit}>
        <div>
          Date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          Visibility:{" "}
          {Object.values(Visibility).map((visibility) => {
            return (
              <label key={visibility}>
                | {visibility}
                <input
                  type="radio"
                  name="visibility"
                  onChange={() => setVisibility(visibility)}
                  required
                />
              </label>
            );
          })}
        </div>
        <div>
          Weather:{" "}
          {Object.values(Weather).map((weather) => {
            return (
              <label key={weather}>
                | {weather}
                <input type="radio" name="weather" onChange={() => setWeather(weather)} required />
              </label>
            );
          })}
        </div>
        <div>
          Comment{" "}
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button>ADD</button>
      </form>
    </div>
  );
};

export default App;
