import mongoose, { Schema } from "mongoose";

const animalSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		breed: {
			type: String,
			required: true,
		},
		hoursTrained: {
			type: Number,
			default: 0,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		imageUrl: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models?.Animal ||
	mongoose.model("Animal", animalSchema);
