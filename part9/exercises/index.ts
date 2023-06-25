/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercise } from "./exerciseCalculator";
//import { calculateExercise } from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) res.status(400).json({ error: "malformatted parameters" });

  res.status(200).json({
    height,
    weight,
    bmi: calculateBmi(height, weight),
  });
});

app.post("/exercises", (req, res) => {
  let daily: number[] = req.body.daily;
  daily = daily.map((n) => Number(n));
  const target = Number(req.body.target);

  if (!daily || !target) res.status(400).json({ error: "missing parameters" });
  if (isNaN(target) || !daily.every((n) => !isNaN(n)))
    res.status(400).json({ error: "malformatted parameters" });

  res.json(calculateExercise(daily, target));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
