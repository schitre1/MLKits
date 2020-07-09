const outputs = [];
const predictionPoint = 300;
let k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  // save runs for test data
  //recording observation data
  outputs.push([dropPosition, bounciness, size, bucketLabel]);

}

function runAnalysis() {
  // Write code here to analyze stuff
  //Call split data set
  const testSetSize = 10;
  const [testSet, trainingSet] = splitDataSet(outputs, testSetSize); //test data size fixed at 10

  // old way of doing things:
  // let numCorrect = 0;
  // for (let i = 0; i < testSet.length; i++) {
  //   const bucket = knn(trainingSet, testSet[i][0]);
  //   if (bucket === testSet[i][3]) numCorrect++;
  // }

  // use lodash for same calc
  //we need to compare how accurate the prediction was
  const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, testPoint[0]) === testPoint[3])
    .size()
    .divide(testSetSize)
    .value();

  console.log('Accuracy', accuracy);


}

function distance(pointA, pointB) {
  return Math.abs(pointA - pointB)
}

function splitDataSet(data, testCount) { //testCount number of records in test set
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount); //everything from 0 to testCount
  const trainingSet = _.slice(shuffled, testCount); //everything from testCount to end of array

  return [testSet, trainingSet];
}

//for training we will use trainingSet
//point is point from where ball is dropped, for which we are trying to make a prediction
function knn(data, point) {
  return _.chain(data)
    .map(row => [distance(row[0], point), row[3]])
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