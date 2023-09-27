import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { startOfMonth, endOfMonth } from "date-fns";
import { useGetReportQuery } from "../../../services/endpoints/reports";

const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};

const ReportTable = () => {
  const { start, end } = getCurrentMonthRange();
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const queryString = useMemo(() => {
    const sort =
      sorting.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",") || "asc";
    const offset = pagination.pageIndex * pagination.pageSize;
    const limit = pagination.pageSize;
    const select = "invoiceId,meterCode,invoiceDate,userName,totalAmount";

    return `/reports?startDate=${
      startDate.toISOString().split("T")[0]
    }&endDate=${
      endDate.toISOString().split("T")[0]
    }&offset=${offset}&limit=${limit}&sort=${sort}&select=${select}`;
  }, [startDate, endDate, pagination, sorting, columnFilters]);

  const {
    isLoading,
    isFetching,
    isSuccess,
    data: fetchedData,
    isError,
  } = useGetReportQuery(queryString);

  useEffect(() => {
    if (isSuccess) {
      setData(fetchedData.data.reports);
      setRowCount(fetchedData.data.totalRecords);
    }
  }, [isSuccess, fetchedData]);

  const columns = useMemo(
    () => [
      { accessorKey: "date", header: "Fecha" },
      { accessorKey: "userName", header: "Nombre del Usuario" },
      { accessorKey: "meterCode", header: "Código del Medidor" },
      { accessorKey: "amount", header: "Monto" },
    ],
    []
  );

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: true,
    headers: columns.map((c) => c.header),
  });

  console.log("csvConfig:", csvConfig);

  const handleExportRows = (rows) => {
    const csv = generateCsv(csvConfig)(rows.map((row) => row.original));
    download(csvConfig)(csv);
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          Reporte de ingresos
        </Typography>
        <MaterialReactTable
          columns={columns}
          data={data}
          manualPagination
          manualSorting
          manualFiltering
          enableGlobalFilter={false}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onColumnFiltersChange={setColumnFilters}
          localization={MRT_Localization_ES}
          rowCount={rowCount}
          initialState={{
            columnVisibility: {
              /* ajusta según tus necesidades */
            },
            showGlobalFilter: false,
            showColumnFilters: true,
            showColumnVisibility: true,
            showRowStripes: true,
            showSearchField: false,
          }}
          state={{
            pagination,
            sorting,
            columnFilters,
            showAlertBanner: isError,
            showProgressBars: isFetching || isLoading,
          }}
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

export default ReportTable;
