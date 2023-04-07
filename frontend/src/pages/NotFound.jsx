import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

const NotFound = () => {
  const theme = useTheme()
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      <Helmet>
        <title>Error: No encontrado</title>
      </Helmet>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'background.paper',
          display: 'flex',
          minHeight: '100%',
          px: 3,
          py: '80px',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            align="center"
            color="textPrimary"
            variant={mobileDevice ? 'h4' : 'h1'}
          >
            404: La página que buscas no está aquí
          </Typography>
          <Typography
            align="center"
            color="textSecondary"
            sx={{ mt: 0.5 }}
            variant="subtitle2"
          >
            O intentaste una ruta prohibida o viniste aquí por error.
            Sea lo que sea, intenta usar la navegación.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6,
            }}
          >
            <Box
              alt="Under development"
              component="img"
              src={`/static/error/error404_${theme.palette.mode}.svg`}
              sx={{
                height: 'auto',
                maxWidth: '100%',
                width: 400,
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6,
            }}
          >
            <Button
              color="primary"
              component={RouterLink}
              to="/"
              variant="outlined"
            >
              De vuelta a casa
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default NotFound
