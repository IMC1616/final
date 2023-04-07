import React from "react";
import { Helmet } from "react-helmet-async";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import LoginJWT from "../../components/authentication/LoginJWT";

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Iniciar sesión</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "background.default",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm" sx={{ py: "80px" }}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <div style={{ flex: 2 }}>
                  <Typography color="textPrimary" gutterBottom variant="h4">
                    Iniciar sesión
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                <LoginJWT />
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
