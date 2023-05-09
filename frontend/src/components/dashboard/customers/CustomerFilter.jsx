import React, { useMemo, useState } from "react";
import { TextField, Box, MenuItem } from "@mui/material";
import { useGetCategoriesQuery } from "../../../services/endpoints/categories";
import { meterStatuses } from "../../../constants";

const CustomerFilter = ({
  searchCi,
  setSearchCi,
  searchMeterCode,
  setSearchMeterCode,
  selectedCategory,
  setSelectedCategory,
  selectedMeterStatus,
  setSelectedMeterStatus
}) => {

  const handleChangeMeterStatus = (event) => {
    setSelectedMeterStatus(event.target.value);
  };

  const queryString = useMemo(() => {
    const url = `/categories`;

    return url;
  }, []);

  const {
    isLoading: isLoadingCategories,
    isFetching: isFetchingCategories,
    isSuccess: isSuccessCategories,
    data: fetchedDataCategories,
    isError: isErrorCategories,
  } = useGetCategoriesQuery(queryString);

  const handleChangeCategory = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Box
      sx={{
        mb: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextField
        label="Buscar por CI"
        value={searchCi}
        onChange={(e) => setSearchCi(e.target.value)}
        variant="outlined"
        sx={{ mr: 2, minWidth: "200px" }}
      />
      <TextField
        label="Buscar por C/Medidor"
        value={searchMeterCode}
        onChange={(e) => setSearchMeterCode(e.target.value)}
        variant="outlined"
        sx={{ mr: 2, minWidth: "200px" }}
      />
      {isSuccessCategories && (
        <TextField
          id="outlined-category-native-simple"
          label="Categoría"
          name="category"
          onChange={handleChangeCategory}
          value={selectedCategory}
          variant="outlined"
          select
          sx={{ mr: 2, minWidth: "200px" }}
        >
          <MenuItem value="">
            <em>Ninguna</em>
          </MenuItem>
          {fetchedDataCategories.data.categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name} - Precio:{" "}
              {category.pricePerCubicMeter
                ? `${category.pricePerCubicMeter} por m³`
                : `${category.fixedPrice} fijo`}
            </MenuItem>
          ))}
        </TextField>
      )}
      {meterStatuses && (
        <TextField
          id="outlined-meter-status-native-simple"
          label="Estado del medidor"
          name="meterStatus"
          onChange={handleChangeMeterStatus}
          value={selectedMeterStatus}
          variant="outlined"
          select
          sx={{ minWidth: "200px" }}
        >
          <MenuItem value="">
            <em>Ninguno</em>
          </MenuItem>
          {Object.entries(meterStatuses).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Box>
  );
};

export default CustomerFilter;
