import { useCallback, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PlusIcon from "../../../icons/Plus";
import FilterIcon from "../../../icons/Filter";
import InvoiceListSidebar from "../../../components/dashboard/invoices/InvoiceListSidebar";
import InvoiceListContainer from "../../../components/dashboard/invoices/InvoiceListContainer";
import InvoiceListTable from "../../../components/dashboard/invoices/InvoiceListTable";

const Invoices = () => {
  const rootRef = useRef(null);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const [openSidebar, setOpenSidebar] = useState(lgUp);

  const handleFiltersToggle = useCallback(() => {
    setOpenSidebar((prevState) => !prevState);
  }, []);

  const handleFiltersClose = useCallback(() => {
    setOpenSidebar(false);
  }, []);

  return (
    <>
      <Helmet>Cobranza</Helmet>
      <Box
        component="main"
        sx={{
          display: "flex",
          flex: "1 1 auto",
          overflow: "hidden",
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: "flex",
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <InvoiceListSidebar
            container={rootRef.current}
            onClose={handleFiltersClose}
            open={openSidebar}
          />
          <InvoiceListContainer open={openSidebar}>
            <Stack spacing={4}>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <div>
                  <Typography variant="h4">Facturas</Typography>
                </div>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon>
                        <FilterIcon />
                      </SvgIcon>
                    }
                    onClick={handleFiltersToggle}
                  >
                    Filtros
                  </Button>
                  
                </Stack>
              </Stack>
              {/* <InvoiceListSummary /> */}
              <InvoiceListTable />
            </Stack>
          </InvoiceListContainer>
        </Box>
      </Box>
    </>
  );
};

export default Invoices;
