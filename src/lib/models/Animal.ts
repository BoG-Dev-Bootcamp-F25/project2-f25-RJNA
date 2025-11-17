import mongoose, { Schema } from "mongoose";

const animalSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', // owner of animal is user
    required: true,
  },
  hoursTrained: {
    type: Number,
    default: 0,
  },
  profilePicture: {
    type: String,
    required: true
  }
});

export default mongoose.models?.Animal || mongoose.model("Animal", animalSchema);

// Animal {
//   _id: ObjectId // animal's ID
//   name: string // animal's name
//   breed: string // animal's breed
//   owner: ObjectId // id of the animal's owner
//   hoursTrained: number // total number of hours the animal has been trained for
//   profilePicture: string // url to an image that can be displayed in an <img> tag
// }