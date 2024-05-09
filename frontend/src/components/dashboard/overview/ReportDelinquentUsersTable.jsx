import React, { useMemo, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import { startOfMonth, endOfMonth } from "date-fns";
import { useGetDelinquentUsersReportQuery } from "../../../services/endpoints/reports";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const DelinquentUsersReport = () => {
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  const {
    data: { data },
    error,
    isLoading,
  } = useGetDelinquentUsersReportQuery({
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // const columns = useMemo(() => {
  //   // Extract all unique dates from all users
  //   const uniqueDates = new Set();
  //   data.forEach((user) => {
  //     user.amounts.forEach((amount) => {
  //       uniqueDates.add(amount.date);
  //     });
  //   });

  //   // Create column configurations for each unique date
  //   const dynamicColumns = Array.from(uniqueDates)
  //     .sort()
  //     .map((date) => ({
  //       accessorKey: date,
  //       header: date,
  //       Cell: ({ row }) => {
  //         // Find the amount object for this date, if it exists
  //         const amountObj = row.original.amounts.find((am) => am.date === date);
  //         return amountObj
  //           ? `${amountObj.amount} (${amountObj.invoiceType})`
  //           : "-";
  //       },
  //     }));

  //   // Include the userName column and all dynamically generated date columns
  //   return [
  //     { accessorKey: "name", header: "Nombre del Usuario" },
  //     ...dynamicColumns,
  //   ];
  // }, [data]); // Ensure useMemo re-computes when data changes

  // console.log(columns);

  // const csvConfig = mkConfig({
  //   fieldSeparator: ",",
  //   quoteStrings: '"',
  //   decimalSeparator: ".",
  //   showLabels: true,
  //   useBom: true,
  //   useKeysAsHeaders: true,
  //   headers: columns.map((c) => c.header),
  // });

  const handleExportRows = (rows) => {
    const csv = generateCsv(csvConfig)(rows.map((row) => row.original));
    download(csvConfig)(csv);
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">
          Reporte de socios con mora de 3 meses
        </Typography>

        <MaterialReactTable
          columns={[
            { accessorKey: "date", header: "Fecha" },
            { accessorKey: "userName", header: "Nombre del Usuario" },
          ]}
          data={[]}
          // manualPagination
          // manualSorting
          // manualFiltering
          // enableGlobalFilter={false}
          localization={MRT_Localization_ES}
          initialState={{
            columnVisibility: {},
            showGlobalFilter: false,
            showColumnFilters: true,
            showColumnVisibility: true,
            showRowStripes: true,
            showSearchField: false,
          }}
          // state={{
          //   pagination,
          //   sorting,
          //   columnFilters,
          //   showAlertBanner: isError,
          //   showProgressBars: isFetching || isLoading,
          // }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                p: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <Grid container spacing={2}>
                <Grid item>
                  <DatePicker
                    label="Fecha de inicio"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: "outlined",
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    label="Fecha de fin"
                    value={endDate}
                    onChange={setEndDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: "outlined",
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    onClick={() => handleExportRows(table.getRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                    variant="contained"
                  >
                    Exportar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DelinquentUsersReport;
