interface ResultsForPeriod {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

function calculateExercises(
  hours: Array<number>,
  target: number
): ResultsForPeriod {
  const trainingDays = hours.filter((day) => day > 0);

  let result = {
    periodLength: hours.length,
    trainingDays: trainingDays.length,
    success: false,
    target: target,
    average: hours.reduce((a: number, b: number) => a + b) / hours.length,
    rating: 0,
    ratingDescription: "",
  };

  result.success = result.average >= target;

  if (result.average <= target / 2) {
    result.rating = 1;
    result.ratingDescription = "Needs improvement";
  } else if (result.average > target / 2 && result.average < target * 1.25) {
    result.rating = 2;
    result.ratingDescription = "not too bad but could be better";
  } else {
    result.rating = 3;
    result.ratingDescription = "above and beyond!";
  }

  return result;
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
