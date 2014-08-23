module.exports = function(mongoose){

  //define schema etc w/o active connection
  var timerSchema = mongoose.Schema({
      user: String,
      startTimeStamp: Number,
      endTimeStamp: { type: Number, default: 0 },
      duration: { type: Number, default: 0 },
      recordedOn: { type: Date, default: Date.now }
  });

  timerSchema.methods.start = function () {
    this.recordedOn = new Date();
    this.startTimeStamp = new Date().getTime();
    console.log('Started at ' + this.startTimeStamp);
  };

  timerSchema.methods.stop = function () {
    this.endTimeStamp = new Date().getTime();
    this.duration = this.endTimeStamp - this.startTimeStamp;
    console.log('Ended at ' + this.endTimeStamp + ' for a duration of ' + this.duration);
  };

  timerSchema.methods.runningFor = function () {
    var now = new Date().getTime();
    return now - this.startTimeStamp;
  };




  var models = {
    Timer : mongoose.model('Timer', timerSchema)
  };

  return models;
}
