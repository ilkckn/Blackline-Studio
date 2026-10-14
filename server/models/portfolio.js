import { Schema, model } from "mongoose";

const portfolioSchema = new Schema(
  {
    artist: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^https?:\/\/.+/i,
        "Image URL must start with http:// or https://",
      ],
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    style: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

export default model("Portfolio", portfolioSchema);
