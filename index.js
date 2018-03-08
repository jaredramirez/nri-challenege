const r = require('ramda');

// DATA

const hardcodedData = [
  {
    id: 1,
    name: 'Nouns',
    standards: [
      {
        id: 1,
        name: 'Common Nouns',
        questions: [[1, 0.7], [2, 0.6]],
      },
      {
        id: 2,
        name: 'Abstract Nouns',
        questions: [[3, 0.8]],
      },
      {
        id: 3,
        name: 'Proper Nouns',
        questions: [[4, 0.2], [5, 0.5], [6, 0.4]],
      },
    ],
  },
  {
    id: 2,
    name: 'Verbs',
    standards: [
      {
        id: 4,
        name: 'Action Verbs',
        questions: [[6, 0.9], [7, 0.1]],
      },
      {
        id: 4,
        name: 'Transative Verbs',
        questions: [[9, 0.3], [10, 0.6], [11, 0.4]],
      },
      {
        id: 5,
        name: 'Reflexive Verbs',
        questions: [[12, 0.2]],
      },
    ],
  },
];

// HELPERS

const log = (s, v) => {
  console.log(s, v);
  return v;
};

const stringToNumber = s => {
  const n = parseInt(s);
  if (isNaN(n)) {
    return null;
  }

  return n;
};

const getDistribution = (numberOfQuestions, strands) => {
  const numberOfStrands = strands.length;

  const questionsPerStrand = Math.ceil(numberOfQuestions / numberOfStrands);

  const questions = strands.reduce((acc, curStrand) => {
    // Get the maximumn number of question in this standard
    const longestStandard = curStrand.standards.reduce((acc, curStandard) => {
      if (curStandard.questions.length > acc) {
        return curStandard.questions.length;
      }
      return acc;
    }, 0);

    let standardQuestions = [];
    let currentQuestionIndex = 0;
    let createdQuestions = 0;

    // Loop & pull the a question out of each standard in the strand until
    // the number of questions for this strand has been met (we air on the side
    // of extra questions, then remove them later)
    while (createdQuestions < questionsPerStrand) {
      standardQuestions = r.concat(
        standardQuestions,
        curStrand.standards.reduce((questionsAcc, curStandard) => {
          const question = curStandard.questions[currentQuestionIndex];

          if (!question || createdQuestions === questionsPerStrand) {
            return questionsAcc;
          }

          createdQuestions = createdQuestions + 1;
          return [...questionsAcc, question];
        }, []),
      );

      currentQuestionIndex = currentQuestionIndex + 1;
      if (currentQuestionIndex === longestStandard) {
        currentQuestionIndex = 0;
      }
    }

    return r.append(standardQuestions, acc);
  }, []);

  let result = questions;

  // If the number of strands did not divide the number of questions evenly,
  // we air of the side of creating too many questions per strand. Then
  // we check if we created to many, and remove an the equal number of questions
  // from each standard
  const extraQuestions =
    questions.reduce((acc, cur) => acc + cur.length, 0) - numberOfQuestions;
  if (extraQuestions > 0) {
    let totalRemoved = 0;
    result = questions.map(questionsForStandard => {
      if (totalRemoved === extraQuestions) {
        return questionsForStandard;
      }

      totalRemoved = totalRemoved + 1;
      return questionsForStandard.slice(0, -1);
    });
  }

  // Since we sort in groups by strands, we concat these into one list
  return result.reduce((acc, cur) => r.concat(acc, cur), []);
};

// SOLUTION

const solve = () => {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.log('Error: Must provide number of questions');
    return;
  }

  const numberOfQuestions = stringToNumber(args[0]);
  if (!numberOfQuestions || numberOfQuestions < 0) {
    console.log('Error: Number of questions must be a number >= to 0');
    return;
  }

  const distribution = getDistribution(numberOfQuestions, hardcodedData);

  // We sort the questions by difficulty, map to get the ids, then format it
  const questionsList = r.pipe(
    r.sortBy(([_, difficulty]) => difficulty), // If there are duplicates, this sorts them to be right next to each other
    r.map(([id, _]) => id),
    r.join(','),
  )(distribution);

  console.log(questionsList);
};

solve();
