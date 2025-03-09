// AboutUs.tsx (Plain React + Material UI)

import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Box
} from "@mui/material";

// Replace these URLs with actual images or local image paths if you prefer
const teamData = [
  {
    name: "Hemant Smart",
    role: "Developer",
    image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
    description: "Hemant is a skilled Full Stack Developer focused on modern web technologies."
  },
  {
    name: "Dillan Kerai",
    role: "Developer",
    image: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2",
    description: "Dillan specializes in DevOps and cloud infrastructure, ensuring smooth deployments."
  },
  {
    name: "Angie Patel",
    role: "Marketing",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    description: "Angie drives brand growth through strategic marketing campaigns and outreach."
  },
  {
    name: "Arjun Krishnan",
    role: "Developer",
    image: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a",
    description: "Arjun is a React wizard, focusing on performance and UX for our frontend products."
  },
  {
    name: "Mia Mistry",
    role: "Marketing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    description: "Mia brings fresh ideas and handles digital campaigns for new product launches."
  }
];

export default function AboutUs() {
  return (
    <Container maxWidth="md" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      {/* Title */}
      <Typography variant="h4" component="h1" gutterBottom>
        About Us
      </Typography>

      <Grid container spacing={4}>
        {teamData.map((member, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card elevation={3}>
              {/* Image Section */}
              <CardMedia
                component="img"
                alt={member.name}
                height="240"
                image={member.image}
                style={{ objectFit: "cover" }}
              />
              {/* Content Section */}
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {member.role}
                </Typography>
                <Box marginTop={1}>
                  <Typography variant="body2" color="text.primary">
                    {member.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
