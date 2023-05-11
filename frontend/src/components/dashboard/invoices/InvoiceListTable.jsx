import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { format } from "date-fns";
import numeral from "numeral";
import ArrowRightIcon from "../../../icons/ArrowRight";
import Payments from "../../../icons/Payments";
import {
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import {
  selectEndDate,
  selectGroup,
  selectMeterCode,
  selectStartDate,
  selectStatus,
} from "../../../features/invoices/invoiceFiltersSlice";
import Scrollbar from "../../Scrollbar";
import getInitials from "../../../utils/getInitials";
import { useGetInvoicesQuery } from "../../../services/endpoints/invoices";
import PaymentModal from "./PaymentModal";
import {
  closeModal,
  openModal,
  selectModalComponent,
  selectModalType,
  selectShowModal,
} from "../../../features/modal/modalSlice";
import { statusMap } from "../../../constants";

const groupInvoices = (invoices) => {
  return invoices.reduce(
    (acc, invoice) => {
      const { paymentStatus } = invoice;

      return {
        ...acc,
        [paymentStatus]: [...acc[paymentStatus], invoice],
      };
    },
    {
      pending: [],
      paid: [],
    }
  );
};

const InvoiceRow = ({ invoice, ...other }) => {
  const dispatch = useDispatch();

  const statusColor = statusMap[invoice.paymentStatus].color;

  const totalAmount = numeral(invoice.totalAmount).format("0,0.00");
  const invoiceDate =
    invoice.invoiceDate && format(new Date(invoice.invoiceDate), "dd/MM/yyyy");

  const paymentDate =
    invoice.paymentDate && format(new Date(invoice.paymentDate), "dd/MM/yyyy");

  return (
    <TableRow
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      {...other}
    >
      <TableCell width="25%">
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          component={RouterLink}
          to={`/dashboard/invoices/${invoice._id}`}
          sx={{
            display: "inline-flex",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <Avatar sx={{ height: 42, width: 42 }}>
            {getInitials(`${invoice.user.name} ${invoice.user.lastName}`)}
          </Avatar>
          <div>
            <Typography color="text.primary" variant="subtitle2">
              {invoice._id}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {`${invoice.user.name} ${invoice.user.lastName}`}
            </Typography>
          </div>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">{`${totalAmount} Bs`}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">Emitido</Typography>
        <Typography color="text.secondary" variant="body2">
          {invoiceDate}
        </Typography>
      </TableCell>
      {paymentDate && (
        <TableCell>
          <Typography variant="subtitle2">Fecha de pago</Typography>
          <Typography color="text.secondary" variant="body2">
            {paymentDate}
          </Typography>
        </TableCell>
      )}
      <TableCell align="right">
        <Chip
          label={statusMap[invoice.paymentStatus].label}
          color={statusColor}
          variant="outlined"
          size="medium"
        />
      </TableCell>
      {paymentDate ? (
        <TableCell align="right">
          <IconButton
            component={RouterLink}
            to={`/dashboard/invoices/${invoice._id}`}
          >
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          </IconButton>
        </TableCell>
      ) : (
        <TableCell align="right">
          <Button
            endIcon={
              <SvgIcon>
                <Payments />
              </SvgIcon>
            }
            variant="contained"
            color="error"
            onClick={() => {
              dispatch(
                openModal({
                  component: "invoice",
                  type: "create",
                  data: invoice,
                })
              );
            }}
          >
            Cobrar
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

export const InvoiceListTable = ({ ...other }) => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [invoices, setInvoices] = useState([]);
  const [invoicesCount, setInvoicesCount] = useState(0);

  const showModal = useSelector(selectShowModal);
  const modalType = useSelector(selectModalType);
  const modalComponent = useSelector(selectModalComponent);

  const meterCode = useSelector(selectMeterCode);
  const startDate = useSelector(selectStartDate);
  const endDate = useSelector(selectEndDate);
  const pendingOnly = useSelector(selectStatus);
  const group = useSelector(selectGroup);

  const queryString = useMemo(() => {
    const offset = pagination.pageIndex * pagination.pageSize;
    const limit = pagination.pageSize;

    const params = new URLSearchParams();

    if (meterCode) {
      params.append("meterCode", meterCode);
    }

    if (pendingOnly) {
      params.append("pendingOnly", pendingOnly);
    }

    if (startDate) {
      params.append("startDate", startDate.toISOString());
    }

    if (endDate) {
      params.append("endDate", endDate.toISOString());
    }

    params.append("offset", offset);
    params.append("limit", limit);

    const url = `/invoices?${params.toString()}`;

    return url;
  }, [pagination, meterCode, startDate, endDate, pendingOnly, group]);

  const {
    isLoading: isLoadingInvoices,
    isFetching: isFetchingInvoices,
    isSuccess: isSuccessInvoices,
    data: fetchedDataInvoices,
    isError: isErrorInvoices,
  } = useGetInvoicesQuery(queryString);

  useEffect(() => {
    if (isSuccessInvoices) {
      setInvoices(fetchedDataInvoices.data.invoices);
      setInvoicesCount(fetchedDataInvoices.data.totalRecords);
    }
  }, [isSuccessInvoices, fetchedDataInvoices]);

  const handleRowsPerPageChange = useCallback((event) => {
    setPagination((prevState) => ({
      ...prevState,
      pageSize: parseInt(event.target.value, 10),
    }));
  }, []);

  const handlePageChange = useCallback((event, page) => {
    setPagination((prevState) => ({
      ...prevState,
      pageIndex: page,
    }));
  }, []);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  let content;

  if (group) {
    const groupedInvoices = groupInvoices(invoices);
    const statuses = Object.keys(groupedInvoices);

    content = (
      <Stack spacing={6}>
        {statuses.map((status) => {
          const groupTitle = statusMap[status].label;
          const count = groupedInvoices[status].length;
          const invoices = groupedInvoices[status];
          const hasInvoices = invoices.length > 0;

          return (
            <Stack key={groupTitle} spacing={2}>
              <Typography color="text.secondary" variant="h6">
                {groupTitle} ({count})
              </Typography>
              {hasInvoices && (
                <Card>
                  <Scrollbar>
                    <Table sx={{ minWidth: 600 }}>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <InvoiceRow key={invoice._id} invoice={invoice} />
                        ))}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </Card>
              )}
            </Stack>
          );
        })}
      </Stack>
    );
  } else {
    content = (
      <Card>
        <Table>
          <TableBody>
            {invoices.map((invoice) => (
              <InvoiceRow key={invoice._id} invoice={invoice} />
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <Stack spacing={4} {...other}>
      {content}
      <TablePagination
        component="div"
        count={invoicesCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        page={pagination.pageIndex}
        rowsPerPage={pagination.pageSize}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <PaymentModal
        isOpen={
          showModal && modalComponent === "invoice" && modalType !== "delete"
        }
        handleClose={handleCloseModal}
      />
    </Stack>
  );
};

export default InvoiceListTable;
