import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slideUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  content: { type: String, required: true },
  locked: { type: Boolean, default: true },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  homeViewContent: { type: String },
  modules: { type: [moduleSchema], default: [] },
  imageUrl: { type: String },
});

export const CourseModel = mongoose.model("Course", courseSchema);
