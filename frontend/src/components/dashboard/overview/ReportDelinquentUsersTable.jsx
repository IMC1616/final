import React, { useEffect, useMemo, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Dialog,
  SvgIcon,
} from "@mui/material";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { useGetDelinquentUsersReportQuery } from "../../../services/endpoints/reports";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import ArrowLeftIcon from "../../../icons/ArrowLeft";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { mkConfig, generateCsv, download } from "export-to-csv";
import TablePDF from "./TablePDF";
import ReactPDF, { PDFViewer } from "@react-pdf/renderer";

const DelinquentUsersReport = () => {
  const [startDate, setStartDate] = useState(
    startOfMonth(subMonths(new Date(), 3))
  );
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [tableData, setTableData] = useState([]);
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [pdfDocument, setPdfDocument] = useState(null);

  const { data, error, isLoading } = useGetDelinquentUsersReportQuery({
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  // Process and set table data whenever the data changes
  useEffect(() => {
    if (data && data.data) {
      const processedData = data.data.map((user) => {
        const userData = { name: user.name };
        user.amounts.forEach((amount) => {
          if (amount.invoiceType === "Reconnection") {
            const key = `${amount.invoiceType}`;
            userData[key] = amount.amount; // Assuming each date+type is unique per user
          } else {
            userData[amount.date] = amount.amount;
          }
        });
        return userData;
      });
      setTableData(processedData);
    }
  }, [data]); // Only re-run when data changes

  const columns = useMemo(() => {
    const months = new Set();
    const reconnections = new Set();

    tableData.forEach((user) => {
      Object.keys(user).forEach((key) => {
        if (key.includes("Reconnection")) {
          reconnections.add(key);
        } else if (key !== "name") {
          months.add(key.split(" ")[0]); // Remove any suffix to just get the date
        }
      });
    });

    return [
      { accessorKey: "name", header: "Nombre del Usuario" },
      ...Array.from(months)
        .sort()
        .map((month) => ({
          accessorKey: month,
          header: month,
        })),
      ...Array.from(reconnections)
        .sort()
        .map((recon) => ({
          accessorKey: recon,
          header: recon,
        })),
    ];
  }, [tableData]);

  console.log("Columns:", columns);
  console.log("Table Data:", tableData);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: true,
    headers: columns.map((c) => c.header),
  });

  const handleExportRows = async () => {
    if (!data || !data.data) return;

    const dataForPdf = data.data.map((user) => ({
      name: user.name,
      ...Object.fromEntries(
        user.amounts.map((amount) => [
          amount.date,
          `${amount.amount} (${amount.invoiceType})`,
        ])
      ),
    }));

    const pdfBlob = await ReactPDF.pdf(
      <TablePDF
        title="Reporte de socios con mora"
        columns={columns}
        data={dataForPdf}
      />
    ).toBlob();

    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfDocument(pdfUrl);
    setOpenPdfViewer(true);
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = pdfDocument;
    link.setAttribute("download", "reporte-de-socios-con-mora.pdf");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">
          Reporte de socios con mora de 3 meses
        </Typography>

        <MaterialReactTable
          columns={columns}
          data={tableData}
          localization={MRT_Localization_ES}
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
                        size: "small",
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
                        size: "small",
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

                  {/* <Button
                    onClick={downloadPDF}
                    color="secondary"
                    variant="contained"
                    startIcon={<PictureAsPdfIcon />}
                  >
                    Exportar a PDF
                  </Button> */}

                  <Button
                    onClick={handleExportRows}
                    color="primary"
                    startIcon={<PictureAsPdfIcon />}
                  >
                    Preview PDF
                  </Button>
                  {pdfDocument && (
                    <Button
                      onClick={downloadPDF}
                      color="secondary"
                      startIcon={<FileDownloadIcon />}
                    >
                      Download PDF
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        />
      </CardContent>

      <Dialog
        fullScreen
        open={openPdfViewer}
        onClose={() => setOpenPdfViewer(false)}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              p: 2,
            }}
          >
            <Button
              color="inherit"
              startIcon={
                <SvgIcon>
                  <ArrowLeftIcon />
                </SvgIcon>
              }
              onClick={() => setOpenPdfViewer(false)}
            >
              Cerrar
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <TablePDF
                title="Reporte de socios con mora"
                columns={columns}
                data={tableData}
              />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </Card>
  );
};

export default DelinquentUsersReport;
