import { Box, Typography } from "@mui/material";

export const MainContent = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">Welcome to the Dashboard!</Typography>
      <Typography paragraph>
        This is the main content area. You can add anything here.
      </Typography>
    </Box>
  );
};