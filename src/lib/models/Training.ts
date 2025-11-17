import mongoose, { Schema } from "mongoose";

const trainingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    default: 0,
  },
  profilePicture: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  animal: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  }
});

export default mongoose.models?.Training || mongoose.model("Training Log", trainingSchema);

// TrainingLog {
//   _id: ObjectId // training log's id
//   user: ObjectId // user this training log corresponds to
//   animal: ObjectId // animal this training log corresponds to
//   title: string // title of training log
//   date: Date // date of training log
//   description: string // description of training log
//   hours: number // number of hours the training log records
// }