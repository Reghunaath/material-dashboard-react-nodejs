import HttpService from "./htttp.service";

class CourseService {
  getAllCourses = async () => {
    const endpoint = "api/courses";
    return await HttpService.get(endpoint);
  };
  purchaseCourse = async (email, courseId) => {
    const endpoint = "api/courses/purchase";
    return await HttpService.post(endpoint, { email, courseId });
  };

  getPurchasedCourses = async (email) => {
    const endpoint = `api/courses/purchased/${email}`;
    return await HttpService.get(endpoint);
  };
}

export default new CourseService();
