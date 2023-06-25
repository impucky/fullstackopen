interface Results {
  days: number;
  daysTrained: number;
  target: number;
  average: number;
  targetReached: boolean;
  rating: number;
  verdict: string;
}

interface TrainingData {
  days: number[];
  target: number;
}

const parseArgs = (args: string[]): TrainingData => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const days = args.splice(3).map((n) => Number(n));
  const target = Number(args[2]);

  if (!isNaN(target) && days.every((n) => !isNaN(n))) {
    return {
      days,
      target,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateExercise = (data: number[], target: number): Results => {
  const days = data.length;
  const daysTrained = days - data.filter((n) => n === 0).length;
  const average = data.reduce((a, b) => a + b) / days;
  const targetReached = average >= target ? true : false;
  let rating = Number((average / target + 1).toFixed(2));
  if (rating > 3) rating = 3;
  let verdict;

  if (rating === 3) verdict = "Amazing!!";
  else if (rating >= 2.5) verdict = "Great!";
  else if (rating >= 2) verdict = "Ya did good!";
  else if (rating >= 1.75) verdict = "Almost reached your target!";
  else if (rating >= 1.5) verdict = "Could be better";
  else if (rating >= 1.25) verdict = "Not great";
  else if (rating === 1) verdict = "Oops";
  else verdict = "Pretty bad";

  return {
    days,
    daysTrained,
    target,
    average,
    targetReached,
    rating,
    verdict,
  };
};

if (process.argv.length > 2) {
  const { days, target } = parseArgs(process.argv);
  console.log("args", calculateExercise(days, target));
}
