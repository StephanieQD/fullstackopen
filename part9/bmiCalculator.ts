function calculateBmi(heightCm: number, weightKg: number) {
  const m = heightCm / 100;

  const bmi = weightKg / (m * m);
  let message = "";

  if (bmi < 18.5) {
    message = "Underweight";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    message = "Normal (healthy weight)";
  } else if (bmi > 24.9 && bmi <= 29.9) {
    message = "Overweight";
  } else if (bmi > 29.9 && bmi <= 34.9) {
    message = "Obese (Class 1)";
  } else if (bmi > 34.9 && bmi <= 39.9) {
    message = "Obese (Class 2)";
  } else {
    // Over 40
    message = "Obese (Class 3)";
  }

  return message;
}

console.log(calculateBmi(180, 74));
