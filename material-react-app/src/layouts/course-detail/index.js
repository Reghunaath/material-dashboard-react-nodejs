import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CourseService from "services/course.service.js";
import Icon from "@mui/material/Icon";
import TimelineList from "examples/Timeline/TimelineList";
import TimelineItem from "examples/Timeline/TimelineItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";
import chatWithBot from "services/chat.service";
import ReactMarkdown from "react-markdown";

function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [alertIndex, setAlertIndex] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { id } = useParams();
  const email = sessionStorage.getItem("email");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", text: "How can I help you today?" },
  ]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { type: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);

    const botReply = await chatWithBot(chatInput);
    const botMessage = { type: "bot", text: botReply };
    setChatMessages((prev) => [...prev, botMessage]);

    setChatInput("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCourses = await CourseService.getAllCourses();
        const matchedCourse = allCourses.find((c) => c._id === id);
        setCourse(matchedCourse);

        if (email) {
          const purchased = await CourseService.getPurchasedCourses(email);
          if (purchased.includes(id)) {
            setIsPurchased(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [id, email]);

  const handleLockedClick = (e, index) => {
    e.preventDefault();
    setAlertIndex(index);
    setTimeout(() => setAlertIndex(null), 6000);
  };

  const handlePurchase = async () => {
    try {
      await CourseService.purchaseCourse(email, id);
      window.location.reload();
    } catch (err) {
      console.error("Purchase failed:", err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={3} position="relative">
        <MDTypography variant="h4" mb={2}>
          {course?.title}
        </MDTypography>
        <MDTypography variant="body1" mb={4}>
          {course?.description}
        </MDTypography>

        <TimelineList title="Course Modules">
          {course?.modules?.map((module, index) => {
            const isLocked = module.locked && !isPurchased;
            return (
              <TimelineItem
                key={index}
                color="info"
                icon="book"
                title={module.title}
                description={
                  <MDBox>
                    {module.content && (
                      <MDTypography variant="body2" gutterBottom>
                        {module.content}
                      </MDTypography>
                    )}
                    {module.slideUrl && (
                      <MDTypography
                        component="a"
                        href={isLocked ? "#" : module.slideUrl}
                        onClick={
                          isLocked
                            ? (e) => handleLockedClick(e, index)
                            : undefined
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        color={isLocked ? "error" : "info"}
                      >
                        <Icon fontSize="small">picture_as_pdf</Icon>{" "}
                        {isLocked ? "Locked PDF" : "View PDF"}
                      </MDTypography>
                    )}
                    <br />
                    {module.videoUrl && (
                      <MDTypography
                        component="a"
                        href={isLocked ? "#" : module.videoUrl}
                        onClick={
                          isLocked
                            ? (e) => handleLockedClick(e, index)
                            : undefined
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        color={isLocked ? "error" : "info"}
                      >
                        <Icon fontSize="small">ondemand_video</Icon>{" "}
                        {isLocked ? "Locked Video" : "Watch Video"}
                      </MDTypography>
                    )}
                    {alertIndex === index && (
                      <MDBox mt={1}>
                        <MDAlert color="error" dismissible>
                          This module is locked! Please purchase the course to
                          view.
                        </MDAlert>
                      </MDBox>
                    )}
                  </MDBox>
                }
                lastItem={index === course.modules.length - 1}
              />
            );
          })}
        </TimelineList>

        {!isPurchased && (
          <MDBox mt={4}>
            <MDButton variant="gradient" color="info" onClick={handlePurchase}>
              Purchase Course
            </MDButton>
          </MDBox>
        )}

        {showChat && (
          <MDBox
            position="fixed"
            bottom={90}
            right={30}
            width={400}
            bgcolor="#ffffff"
            boxShadow={3}
            borderRadius={2}
            p={2}
            zIndex={999}
            border="1px solid #ccc"
          >
            <MDTypography variant="h6">Chat with us</MDTypography>
            <MDBox
              sx={{
                maxHeight: 300,
                overflowY: "auto",
                mb: 1,
                border: "1px solid #ddd",
                borderRadius: 1,
                p: 1,
                backgroundColor: "#f0f0f0",
              }}
            >
              {chatMessages.map((msg, index) => (
                <MDBox
                  key={index}
                  textAlign={msg.type === "user" ? "right" : "left"}
                  mb={1}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </MDBox>
              ))}
            </MDBox>
            <form onSubmit={handleSendMessage}>
              <MDInput
                fullWidth
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                size="small"
              />
            </form>
          </MDBox>
        )}

        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="3.25rem"
          height="3.25rem"
          bgColor="white"
          shadow="sm"
          borderRadius="50%"
          position="fixed"
          right="2rem"
          bottom="1.5rem"
          zIndex={1000}
          color="dark"
          sx={{ cursor: "pointer" }}
          onClick={() => setShowChat(!showChat)}
        >
          <Icon fontSize="small" color="inherit">
            chat
          </Icon>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default CourseDetail;
