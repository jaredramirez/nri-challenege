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

const stringToNumber = s => {
  const n = parseInt(s);
  if (isNaN(n)) {
    return null;
  }

  return n;
};

const getDistribution = (numberOfQuestions, data) => {
  const dataKeys = Object.keys(data);
  const numberOfStrands = dataKeys.length;
  const mod = numberOfQuestions % numberOfStrands;

  if (mod === 0) {
    // Questions divides # of strands evenly
    const questions = dataKeys.reduce((acc, key) => {
      const strand = dataKeys[key];
    }, []);
  } else {
    console.log('unimplemented');
  }
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
  console.log(distribution);
};

solve();
