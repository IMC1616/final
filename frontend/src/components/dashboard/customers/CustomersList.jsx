import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Typography,
  Grid,
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
import Guard from "../../Guards/Guard";

const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const CustomersList = () => {
  const dispatch = useDispatch();
  const [dataCustomers, setDataCustomers] = useState([]);

  const [searchCi, setSearchCi] = useState("");
  const [searchMeterCode, setSearchMeterCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMeterStatus, setSelectedMeterStatus] = useState("");

  const showModal = useSelector(selectShowModal);
  const modalType = useSelector(selectModalType);
  const modalComponent = useSelector(selectModalComponent);

  const debouncedSetSearchCi = debounce((value) => setSearchCi(value), 300);
  const debouncedSetSearchMeterCode = debounce(
    (value) => setSearchMeterCode(value),
    300
  );
  const debouncedSetSelectedCategory = debounce(
    (value) => setSelectedCategory(value),
    300
  );
  const debouncedSetSelectedMeterStatus = debounce(
    (value) => setSelectedMeterStatus(value),
    300
  );

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

    return `/customers?${params.toString()}`;
  }, [searchCi, searchMeterCode, selectedCategory, selectedMeterStatus]);

  const {
    isLoading: isLoadingCustomers,
    isFetching: isFetchingCustomers,
    isSuccess: isSuccessCustomers,
    data: fetchedDataCustomers,
    isError: isErrorCustomers,
    error: errorCustomers,
  } = useSearchCustomersQuery(queryString);

  useEffect(() => {
    if (isSuccessCustomers) {
      setDataCustomers(fetchedDataCustomers.data.customers);
    } else if (isErrorCustomers) {
      setDataCustomers([]);
    }
  }, [isSuccessCustomers, isErrorCustomers, fetchedDataCustomers]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return (
    <>
      <CustomerFilter
        searchCi={searchCi}
        setSearchCi={debouncedSetSearchCi}
        searchMeterCode={searchMeterCode}
        setSearchMeterCode={debouncedSetSearchMeterCode}
        selectedCategory={selectedCategory}
        setSelectedCategory={debouncedSetSelectedCategory}
        selectedMeterStatus={selectedMeterStatus}
        setSelectedMeterStatus={debouncedSetSelectedMeterStatus}
      />

      {isFetchingCustomers && (
        <Typography align="center">Cargando...</Typography>
      )}

      {isErrorCustomers && (
        <Typography variant="h6" align="center" color="error">
          {errorCustomers?.data?.message || "Ocurrió un error"}
        </Typography>
      )}

      {!isFetchingCustomers &&
        isSuccessCustomers &&
        dataCustomers.length > 0 && (
          <Grid container spacing={2}>
            {dataCustomers.map((customer) => (
              <Grid key={customer._id} item xs={12} sm={6} md={6} lg={4} xl={4}>
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
                  <Guard item roles={["admin"]}>
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
                  </Guard>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

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
