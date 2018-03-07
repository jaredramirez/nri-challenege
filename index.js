const r = require('ramda');

// HARDCODED DATA

const hardcodedData = {
  nouns: {
    commonNouns: [[1, 0.7], [2, 0.6]],
    abstractNouns: [[3, 0.8]],
    properNouns: [[4, 0.2], [5, 0.5], [6, 0.4]],
  },
  verbs: {
    action: [[6, 0.9], [7, 0.1]],
    transative: [[8, 0.3], [9, 0.6], [10, 0.4]],
    reflexive: [[11, 0.4], [12, 0.2]],
  },
};

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
  const strandKeys = Object.keys(strands);
  const numberOfStrands = strandKeys.length;

  const questionsPerStrand = Math.floor(numberOfQuestions / numberOfStrands);
  const extraQuestion = numberOfQuestions % numberOfStrands;

  const questions = strandKeys.reduce((acc, key) => {
    const strand = strands[key];
    const standardKeys = Object.keys(strand);

    let standardQuestions = [];
    let currentQuestionIndex = 0;
    let createdQuestions = 0;

    while (createdQuestions < questionsPerStrand) {
      standardQuestions = r.concat(
        standardQuestions,
        standardKeys.reduce((questionsAcc, standardKey) => {
          const standard = strand[standardKey];
          const question = standard[currentQuestionIndex];

          if (!question || createdQuestions === questionsPerStrand) {
            return questionsAcc;
          }

          createdQuestions = createdQuestions + 1;
          return [...questionsAcc, question];
        }, []),
      );

      currentQuestionIndex = currentQuestionIndex + 1;
    }

    return r.concat(acc, standardQuestions);
  }, []);

  return questions;
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
  const questionsList = r.pipe(r.map(([id, _]) => id), r.join(','))(
    distribution,
  );
  console.log(questionsList);
};

solve();
