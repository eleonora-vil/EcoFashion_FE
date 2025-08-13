import { Box, Typography, Paper, Avatar, Button } from "@mui/material";
import Typewriter from "typewriter-effect";

const teamMembers = [
  {
    name: "Tài",
    role: "Leader",
    description:
      "With over 10 years of experience in horticulture, Tài is passionate about ecofashion and sustainable materials.",
    avatar: "https://via.placeholder.com/100",
  },
  {
    name: "Vinh",
    role: "Member",
    description:
      "Vinh is an expert in digital marketing and leads our outreach efforts to spread the love for ecofashion.",
    avatar: "https://via.placeholder.com/100",
  },
  {
    name: "Tuấn",
    role: "Member",
    description:
      "Tuấn ensures our customers have the best experience, providing guidance and support.",
    avatar: "https://via.placeholder.com/100",
  },
  {
    name: "Năng",
    role: "Member",
    description:
      "Vinh ensures our customers have the best experience, providing guidance and support.",
    avatar: "https://via.placeholder.com/100",
  },
];

function AboutPage() {
  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: 2,
        height: "100vh",
      }}
    >
      {/* Title Section */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: 2,
          color: "#333",
          textAlign: "center",
        }}
      >
        About Us
      </Typography>

      {/* Typing Animation with Custom Color */}
      <Typography variant="h6" sx={{ marginBottom: 2, textAlign: "center" }}>
        <span style={{ color: "#00796b", fontWeight: "bold" }}>
          <Typewriter
            options={{
              strings: [
                "We provide a wide variety of premium ecofashion designs and materials with care guides.",
              ],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 50,
            }}
          />
        </span>
      </Typography>
      {/* Our History Card */}
      <Paper
        elevation={3}
        sx={{
          marginTop: 4,
          padding: 3,
          backgroundColor: "#ffffff",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", marginBottom: 2, color: "#00796b" }}
        >
          Our History
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
          Founded in 2025, EcoFashion started as a small group business
          dedicated to sharing the love of sustainable fashions . Over the
          years, we have expanded our collection and now serve customers across
          the globe. Our commitment to quality and customer satisfaction remains
          at the heart of everything we do.
        </Typography>
      </Paper>

      {/* Our Values Card */}
      <Paper
        elevation={3}
        sx={{
          marginTop: 4,
          padding: 3,
          backgroundColor: "#ffffff",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", marginBottom: 2, color: "#00796b" }}
        >
          Our Values
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
          We uphold the following values that guide our operations:
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Quality:</strong> We ensure the highest quality in every
          designs and materials we sell.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Sustainability:</strong> We practice environmentally friendly
          methods in our operations.
        </Typography>
        <Typography variant="body1">
          <strong>Community:</strong> We believe in building a community of
          sustainable fashion lovers through engagement and education.
        </Typography>
      </Paper>

      {/* Team Section */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          marginTop: 4,
          marginBottom: 2,
          color: "#444",
          textDecoration: "underline",
        }}
      >
        Meet Our Team
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 4,
          justifyContent: "center",
        }}
      >
        {teamMembers.map((member) => (
          <Box key={member.name}>
            <Paper
              elevation={4}
              sx={{
                padding: 2,
                textAlign: "center",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 10,
                  backgroundColor: "#e0f7fa",
                },
              }}
            >
              <Avatar
                alt={member.name}
                src={member.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  margin: "0 auto",
                  border: "2px solid #90caf9",
                  boxShadow: 1,
                }}
              />
              <Typography
                variant="h6"
                sx={{ marginTop: 2, color: "#333", fontWeight: "bold" }}
              >
                {member.name}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontStyle: "italic", color: "#555" }}
              >
                {member.role}
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginTop: 1, color: "#666", lineHeight: 1.5 }}
              >
                {member.description}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Mission Statement Section */}
      <Box
        sx={{
          marginTop: 4,
          backgroundColor: "#e0f7fa",
          borderRadius: "8px",
          padding: 2,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", marginBottom: 2, color: "#00796b" }}
        >
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
          Our mission is to cultivate a community that appreciates the beauty of
          ecofashion designs and provide them with the resources to thrive. We
          strive to be your go-to source for everything related to ecofashion
          design and materials .
        </Typography>
        <Button
          variant="contained"
          sx={{
            marginTop: 2,
            backgroundColor: "#00796b",
            "&:hover": { backgroundColor: "#004d40" },
          }}
          onClick={() => alert("Join our newsletter!")}
        >
          Join Our Newsletter
        </Button>
      </Box>
    </Box>
  );
}

export default AboutPage;
