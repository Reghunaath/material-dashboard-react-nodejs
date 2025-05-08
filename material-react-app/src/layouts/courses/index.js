import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import CourseService from "services/course.service.js";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CourseService.getAllCourses();
        console.log(response);
        setCourses(response);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <SimpleBlogCard
                image={`images/course/${course.imageUrl}`}
                title={course.title}
                description={course.description}
                action={{
                  type: "internal",
                  route: `/courses/${course._id}`,
                  color: "info",
                  label: "View Course",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Courses;
