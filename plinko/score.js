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
  const bucket = _.chain(outputs)
    .map(row => [distance(row[0]), row[3]])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();

  console.log('Your point will probably fall into', bucket)
}

function distance(point) {
  return Math.abs(point - predictionPoint)
}

function splitDataSet(data, testCount) { //testCount number of records in test set
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount); //everything from 0 to testCount
  const trainingSet = _.slice(shuffled, testCount); //everything from testCount to end of array

  return [testSet, trainingSet];
}