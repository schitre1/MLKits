const outputs = [];
const predictionPoint = 300;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  // save runs for test data
  //recording observation data
  outputs.push([dropPosition, bounciness, size, bucketLabel]);

}

function runAnalysis() {
  // Write code here to analyze stuff
  //Call split data set
  const testSetSize = 100;
  const [testSet, trainingSet] = splitDataSet(minMax(outputs, 3), testSetSize); //test data size fixed at 10

  _.range(1, 20).forEach(k => {
    // use lodash for same calc
    //we need to compare how accurate the prediction was
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[3])
      .size()
      .divide(testSetSize)
      .value();

    console.log('Accuracy with k ', k, accuracy);
  });



}

function distance(pointA, pointB) {
  //now pointA and pointB will be arrays
  //eg. pointA [300, 0.5, 16] pointB [350, 0.55, 16]
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5
}

function splitDataSet(data, testCount) { //testCount number of records in test set
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount); //everything from 0 to testCount
  const trainingSet = _.slice(shuffled, testCount); //everything from testCount to end of array

  return [testSet, trainingSet];
}

//for training we will use trainingSet
//point is point from where ball is dropped, for which we are trying to make a prediction
function knn(data, point, k) {
  return _.chain(data)
    .map(row => {
      return [
        distance(_.initial(row), point), //point from now on should not have label at the end, so new input with no label should also work
        _.last(row)]
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

//feature count tells how many columns of data we want to normalize - 3 in our case
//drop position, bounciness, ball size
function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);
  for (let i = 0; i < featureCount; i++) { //iterate over each feature we want to normalize
    const col = clonedData.map(row => row[i]); //col an array of numbers for one feature
    const min = _.min(col);
    const max = _.max(col);

    //j is for row, i for col
    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min); //update data in place here
    }
  }
  return clonedData;
}