import React from "react";
import Container from "@mui/material/Container";

export default function AppContainer({ children }) {
  return (
    <Container component="main" maxWidth="xs">
      {children}
    </Container>
  );
}
