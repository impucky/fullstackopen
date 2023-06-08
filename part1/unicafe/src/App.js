import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <main>
      <h2>Give feedback</h2>
      <Button onClick={() => setGood(good + 1)} label={"Good"} />
      <Button onClick={() => setNeutral(neutral + 1)} label={"Neutral"} />
      <Button onClick={() => setBad(bad + 1)} label={"Bad"} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </main>
  );
};

const Button = ({ onClick, label }) => (
  <button onClick={onClick}>{label}</button>
);

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = (good - bad) / total;
  const positive = (good * 100) / total;
  return (
    <>
      <h2>Statistics</h2>
      {total ? (
        <table>
          <StatisticLine label="Good" value={good} />
          <StatisticLine label="Neutral" value={neutral} />
          <StatisticLine label="Bad" value={bad} />
          <StatisticLine label="Total" value={total} />
          <StatisticLine label="Average" value={average.toFixed(1)} />
          <StatisticLine label="Positive" value={positive.toFixed(1) + "%"} />
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </>
  );
};

const StatisticLine = ({ label, value }) => (
  <tr>
    <td>{label}:</td>
    <td>{value}</td>
  </tr>
);

export default App;
