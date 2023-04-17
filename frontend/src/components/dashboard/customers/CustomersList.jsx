import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
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
import { useGetUsersQuery } from "../../../services/endpoints/users";
import CustomerFilter from "./CustomerFilter"; // Importa el nuevo componente

const CustomersList = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const [searchCi, setSearchCi] = useState("");
  const [searchMeterCode, setSearchMeterCode] = useState("");

  const filteredCustomers = dataUsers.filter((customer) => {
    return (
      (searchCi === "" || customer.ci.includes(searchCi)) &&
      (searchMeterCode === "" || customer.meterCode.includes(searchMeterCode))
    );
  });


  const queryString = useMemo(() => {
    const sort =
      sorting.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",") || "asc";
    const offset = pagination.pageIndex * pagination.pageSize;
    const limit = pagination.pageSize;
    const select = "name,lastName,email,phone,role";
    const filters = columnFilters
      .map((filter) => `${filter.id}=${filter.value}`)
      .join("&");

    const url = `/users?offset=${offset}&limit=${limit}&sort=${sort}&select=${select}&${filters}`;

    return url;
  }, [pagination, sorting, columnFilters]);

  const {
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    isSuccess: isSuccessUsers,
    data: fetchedDataUsers,
    isError: isErrorUsers,
  } = useGetUsersQuery(queryString);

  useEffect(() => {
    if (isSuccessUsers) {
      setDataUsers(fetchedDataUsers.data.users);
      setRowCount(fetchedDataUsers.data.totalRecords);
    }
  }, [isSuccessUsers, fetchedDataUsers]);

  if (isLoadingUsers) {
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
      />
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {dataUsers.map((user) => (
          <Grid item key={user._id} xs={12} sm={6} md={6} lg={4} xl={4}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {user.name} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small">Editar</Button>
                <Button size="small">Eliminar</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default CustomersList;