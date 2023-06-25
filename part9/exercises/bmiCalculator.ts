interface HeightWeight {
  height: number;
  weight: number;
}

const parseArgsBmi = (args: string[]): HeightWeight => {
  if (args.length !== 4) throw new Error("Arguments should be: height (cm) and weight (m)");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height * height) / 10000);
  if (bmi >= 30) return "Obese";
  if (bmi >= 25) return "Overweight";
  if (bmi >= 18.5) return "Normal weight";
  return "Underweight";
};

if (process.argv.length > 2) {
  const { height, weight } = parseArgsBmi(process.argv);
  console.log(calculateBmi(height, weight));
}
