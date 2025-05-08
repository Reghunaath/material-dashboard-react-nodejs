import { CourseModel } from "../../schemas/course.schema.js";
import { userModel } from "../../schemas/user.schema.js";
import mongoose from "mongoose";
export const getAllCoursesHandler = async (req, res) => {
  try {
    const courses = await CourseModel.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};
export const getPurchasedCoursesByEmailHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await userModel.findOne({ email }, "purchasedCourses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.purchasedCourses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching purchased course IDs", error });
  }
};
export const purchaseCourseHandler = async (req, res) => {
  const { email, courseId } = req.body;
  console.log(req.body);

  if (!email || !courseId) {
    return res.status(400).json({ message: "Email and courseId are required" });
  }

  try {
    const result = await userModel.updateOne(
      { email },
      { $addToSet: { purchasedCourses: new mongoose.Types.ObjectId(courseId) } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Course added to purchasedCourses", result });
  } catch (error) {
    res.status(500).json({ message: "Error adding course to user", error });
  }
};
