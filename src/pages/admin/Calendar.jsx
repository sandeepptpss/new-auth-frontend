// src/pages/admin/Calendar.jsx
import React, { useState } from "react";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { PageHeader } from "../../components/admin/ui";

const formatSelection = (value) => {
  if (Array.isArray(value)) {
    return `${value[0]?.toDateString() || "—"} → ${value[1]?.toDateString() || "—"}`;
  }
  return value?.toDateString() || "—";
};

const MyCalendar = () => {
  const [value, setValue] = useState(new Date());

  return (
    <Box>
      <PageHeader title="Calendar" subtitle="Pick a date to plan around." />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 420px) 1fr" },
          alignItems: "start",
        }}
      >
        <Card elevation={1}>
          <CardContent
            sx={{
              "& .react-calendar": {
                width: "100%",
                border: 0,
                fontFamily: "inherit",
              },
              "& .react-calendar__tile--active": {
                backgroundColor: "primary.main",
                color: "#fff",
                borderRadius: 1,
              },
              "& .react-calendar__tile--now": { borderRadius: 1 },
            }}
          >
            <Calendar onChange={setValue} value={value} className="main-calendar-inner" />
          </CardContent>
        </Card>

        <Card elevation={1}>
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <EventOutlinedIcon color="primary" />
              <Typography variant="h6">Selection</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Currently selected
            </Typography>
            <Chip label={formatSelection(value)} color="primary" variant="outlined" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Events aren't wired to the backend yet — this view is read-only for now.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MyCalendar;
