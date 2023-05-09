import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  CircularProgress,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import CustomerFilter from "./CustomerFilter";
import CustomerModal from "./CustomerModal";
import {
  closeModal,
  openModal,
  selectShowModal,
  selectModalType,
  selectModalComponent,
} from "../../../features/modal/modalSlice";
import { useSearchCustomersQuery } from "../../../services/endpoints/customers";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const CustomersList = () => {
  const dispatch = useDispatch();
  const [dataCustomers, setDataCustomers] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const [searchCi, setSearchCi] = useState("");
  const [searchMeterCode, setSearchMeterCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMeterStatus, setSelectedMeterStatus] = useState("");

  const showModal = useSelector(selectShowModal);
  const modalType = useSelector(selectModalType);
  const modalComponent = useSelector(selectModalComponent);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (searchCi) {
      params.append("ci", searchCi);
    }

    if (searchMeterCode) {
      params.append("code", searchMeterCode);
    }

    if (selectedCategory) {
      params.append("category", selectedCategory);
    }

    if (selectedMeterStatus) {
      params.append("status", selectedMeterStatus);
    }

    const url = `/customers?${params.toString()}`;

    return url;
  }, [searchCi, searchMeterCode, selectedCategory, selectedMeterStatus]);

  const {
    isLoading: isLoadingCustomers,
    isFetching: isFetchingCustomers,
    isSuccess: isSuccessCustomers,
    data: fetchedDataCustomers,
    isError: isErrorCustomers,
  } = useSearchCustomersQuery(queryString);

  useEffect(() => {
    if (isSuccessCustomers) {
      setDataCustomers(fetchedDataCustomers.data.customers);
      setRowCount(fetchedDataCustomers.data.totalRecords);
    }
  }, [isSuccessCustomers, fetchedDataCustomers]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  if (isLoadingCustomers) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CustomerFilter
        searchCi={searchCi}
        setSearchCi={setSearchCi}
        searchMeterCode={searchMeterCode}
        setSearchMeterCode={setSearchMeterCode}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedMeterStatus={selectedMeterStatus}
        setSelectedMeterStatus={setSelectedMeterStatus}
      />
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {dataCustomers.map((customer) => (
          <Grid item key={customer._id} xs={12} sm={6} md={6} lg={4} xl={4}>
            <Card>
              <CardActionArea
                component={RouterLink}
                to={`/dashboard/customers/${customer._id}`}
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {customer.name} {customer.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.email}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    dispatch(
                      openModal({
                        component: "customer",
                        type: "edit",
                        data: customer,
                      })
                    );
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    dispatch(
                      openModal({
                        component: "customer",
                        type: "delete",
                        data: customer,
                      })
                    );
                  }}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CustomerModal
        isOpen={
          showModal && modalComponent === "customer" && modalType !== "delete"
        }
        handleClose={handleCloseModal}
      />

      <DeleteConfirmationModal
        open={
          showModal && modalComponent === "customer" && modalType === "delete"
        }
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default CustomersList;
