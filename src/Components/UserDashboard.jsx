import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Providers/UserProvider";
import { useCurrentEvent } from "../Providers/CurrentEventProvider";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Gauge } from "@mui/x-charts/Gauge";
const API = import.meta.env.VITE_BASE_URL;
import CalendlyWidget from "./CalendlyWidget";

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const { setCurrentEvent } = useCurrentEvent();
  const [feedbackSummary, setFeedbackSummary] = useState([]);

  const handleEventClick = (event) => {
    setCurrentEvent(event);
    localStorage.setItem("currentEvent", JSON.stringify(event));
    navigate(
      `/zoomMeeting?meetingNumber=${
        event.meeting_id
      }&password=${encodeURIComponent(event.password)}`
    );

    if (user.role === "admin") {
      window.open(`${window.location.origin}/feedback`, "_blank");
    }
  };

  const createCompositeKey = (event) => `${event.meeting_id}-${new Date(event.start_time).toISOString()}`;

  const fetchEvents = () => {
    if (!user) {
      navigate("/");
      return;
    }
    fetch(`${API}/interviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Events fetched:", responseJson);
        const eventsMap = new Map();
        responseJson.forEach(event => {
          const key = createCompositeKey(event);
          if (!eventsMap.has(key)) {
            eventsMap.set(key, event);
          }
        });
        setEvents(Array.from(eventsMap.values()));
      })
      .catch(err => {
        console.error(err);
        alert("no records for user found");
      });
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchEvents();
    fetchFeedbackSummary();
  }, [user, navigate]);

  const fetchFeedbackSummary = async () => {
    try {
      const response = await fetch(`${API}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewee_name: user.displayName }),
      });
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setFeedbackSummary(data);
      } else {
        console.log("No feedback data received:", data);
      }
    } catch (error) {
      console.error("Failed to fetch feedback summary:", error);
    }
  };

  const viewDetails = (id) => {
    navigate(`/feedback/details/${id}`);
  };

  return (
    <>
      <Typography
        color="primary.dark"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 35,
          pt: 5,
        }}
      >
        {user?.displayName}'s Dashboard
      </Typography>

      <Grid
        px={10}
        container
        columns={{ xs: 1, m: 7, lg: 7, xl: 7 }}
        rowSpacing={3}
        sx={{ my: 2, mx: "auto" }}
      >
        <Grid item xs={3} sx={{ mx: 2, maxWidth: "100%" }}>
          <Card
            sx={{
              minWidth: "70%",
              border: 1,
              borderColor: "#F3B6B6",
              borderStyle: "solid",
            }}
          >
            <CardMedia
              sx={{
                ml: 4,
                mt: 4,
                width: 160,
                height: 160,
                borderRadius: "50%",
              }}
              image={user?.photoURL}
              title="User Profile Picture"
            />
            <CardContent>
              <Typography sx={{ fontSize: 20 }}>
                Name: {user?.displayName}
              </Typography>
              <Typography>Role: {user.role === "admin" ? "Volunteer" : "Fellow"}</Typography>
              <Typography color="primary">RANK</Typography>
              <Gauge width={100} height={100} value={60} />
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={3}
          rowSpacing={3}
          sx={{ mx: 2, maxWidth: "100%", minWidth: "50%", minHeight: "100%" }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "100%",
              maxHeight: "100%",
              border: 1,
              borderColor: "#F3B6B6",
              borderStyle: "solid",
              overflow: "auto",
              p: 3,
            }}
          >
            <Typography variant="h5" color="primary" gutterBottom>
              Upcoming Events
            </Typography>
            <Button onClick={fetchEvents} variant="contained" color="primary">
              Refresh Events
            </Button>
            <List>
              {events.map((event) => (
                <ListItem
                  key={event.id} // Ensure 'id' is a unique identifier
                  button
                  onClick={() => handleEventClick(event)}
                  sx={{
                    mb: 1,
                    border: 1,
                    borderColor: "#cccccc",
                    borderRadius: "5px",
                  }}
                >
                  <ListItemText
                    primary={`AceIt Interview with ${
                      user.role === "admin"
                        ? event.invitee_name
                        : event.inviter_name
                    }`}
                    secondary={`Starts at: ${new Date(event.start_time).toLocaleString("en-US", { timeZone: 'America/New_York' })}`}

                  />
                </ListItem>
              ))}
            </List>
          </Card>

          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "100%",
              maxHeight: "100%",
              border: 1,
              borderColor: "#F3B6B6",
              borderStyle: "solid",
              overflow: "auto",
              p: 3,
            }}
          >
            <Typography variant="h5" color="primary" gutterBottom>
              Latest Feedback Summary
            </Typography>
            <List>
              {feedbackSummary.length > 0 ? (
                feedbackSummary.map((feedback) => (
                  <ListItem
                    sx={{
                      mb: 1,
                      border: 1,
                      borderColor: "#cccccc",
                      borderRadius: "5px",
                    }}
                    button
                    key={feedback.id}
                    onClick={() => viewDetails(feedback.id)}
                  >
                    <ListItemText
                      primary={`Score: ${feedback.total_grade} from ${feedback.admin_name}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No feedback available.</Typography>
              )}
            </List>
          </Card>
        </Grid>

        <Grid item xs={7} sx={{ mx: 2 }}>
          <Card
            sx={{
              maxWidth: "100%",
              minHeight: "800px",
              maxHeight: "100%",
              border: 1,
              borderColor: "#F3B6B6",
              borderStyle: "solid",
              overflow: "auto",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <CardContent sx={{ minWidth: "100%" }}>
              <Typography
                variant="h5"
                color="primary"
                gutterBottom
                style={{
                  display: "flex",
                  width: "100%",
                  minWidth: "100%",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                Book Meeting
              </Typography>
              <CalendlyWidget />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default UserDashboard;
