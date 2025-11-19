import mongoose, { Schema } from "mongoose";
import { title } from "process";

const trainingSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	hours: {
		type: Number,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	animalId: {
		type: Schema.Types.ObjectId,
		ref: "Animal",
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.models?.Training ||
	mongoose.model("Training", trainingSchema);
