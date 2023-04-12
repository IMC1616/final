import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import PlusIcon from "../../../icons/Plus";
import { selectSettings } from "../../../features/settings/settingsSlice";
import CategoryListTable from "../../../components/dashboard/categories/CategoryListTable";
import { openModal } from "../../../features/modal/modalSlice";

const Categories = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  return (
    <>
      <Helmet>Lista de categorías</Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                Categorías
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color="primary"
                  startIcon={<PlusIcon />}
                  sx={{ m: 1, fontSize: { lg: 14, md: 13, sm: 12, xs: 11 } }}
                  onClick={() =>
                    dispatch(
                      openModal({ component: "category", type: "create" })
                    )
                  }
                  variant="contained"
                >
                  Agregar
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <CategoryListTable />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Categories;
