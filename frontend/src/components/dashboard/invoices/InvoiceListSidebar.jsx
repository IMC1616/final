import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import XIcon from "../../../icons/X";
import SearchMdIcon from "../../../icons/Search";
import {
  Box,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  selectEndDate,
  selectGroup,
  selectMeterCode,
  selectStartDate,
  selectStatus,
  setEndDate,
  setGroup,
  setMeterCode,
  setStartDate,
  setStatus,
} from "../../../features/invoices/invoiceFiltersSlice";

const InvoiceListSidebar = ({ container, onClose, open, ...other }) => {
  const dispatch = useDispatch();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  
  const meterCode = useSelector(selectMeterCode);
  const startDate = useSelector(selectStartDate);
  const endDate = useSelector(selectEndDate);
  const status = useSelector(selectStatus);
  const group = useSelector(selectGroup);

  const queryRef = useRef(meterCode);
  
  const handleQueryChange = useCallback((event) => {
    event.preventDefault();
    dispatch(setMeterCode(queryRef.current?.value || ""));
  }, []);

  const handleStartDateChange = useCallback((date) => {
    // Prevent end date to be before start date
    if (endDate && date && date > endDate) {
      dispatch(setEndDate(date));
    }

    dispatch(setStartDate(date));
  }, []);

  const handleEndDateChange = useCallback((date) => {
    // Prevent start date to be after end date
    if (startDate && date && date < startDate) {
      dispatch(setStartDate(date));
    }

    dispatch(setEndDate(date));
  }, []);

  const handleStatusChange = useCallback((event) => {
    dispatch(setStatus(event.target.checked));
  }, []);

  const handleGroupChange = useCallback((event) => {
    dispatch(setGroup(event.target.checked));
  }, []);

  const content = (
    <div>
      <Stack
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        sx={{ p: 3 }}
      >
        <Typography variant="h5">Filtros</Typography>
        {!lgUp && (
          <IconButton onClick={onClose}>
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        )}
      </Stack>
      <Stack spacing={3} sx={{ p: 3 }}>
        <form onSubmit={handleQueryChange}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputProps={{ ref: queryRef }}
            placeholder="Código del medidor"
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </form>
        <div>
          <FormLabel
            sx={{
              display: "block",
              mb: 2,
            }}
          >
            Fecha de emisión
          </FormLabel>
          <Stack spacing={2}>
            <DatePicker
              inputFormat="dd/MM/yyyy"
              label="Desde"
              onChange={handleStartDateChange}
              renderInput={(inputProps) => <TextField {...inputProps} />}
              value={startDate || null}
            />
            <DatePicker
              inputFormat="dd/MM/yyyy"
              label="Hasta"
              onChange={handleEndDateChange}
              renderInput={(inputProps) => <TextField {...inputProps} />}
              value={endDate || null}
            />
          </Stack>
        </div>
        <FormControlLabel
          control={
            <Switch
              checked={status}
              onChange={handleStatusChange}
            />
          }
          label="Sólo pendientes"
        />
        <FormControlLabel
          control={<Switch checked={group} onChange={handleGroupChange} />}
          label="Agrupar por estado"
        />
      </Stack>
    </div>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={open}
        PaperProps={{
          elevation: 16,
          sx: {
            border: "none",
            borderRadius: 1,
            overflow: "hidden",
            position: "relative",
            width: 380,
          },
        }}
        SlideProps={{ container }}
        variant="persistent"
        sx={{ p: 3 }}
        {...other}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      hideBackdrop
      ModalProps={{
        container,
        sx: {
          pointerEvents: "none",
          position: "absolute",
        },
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: "100%",
          width: 380,
          pointerEvents: "auto",
          position: "absolute",
        },
      }}
      SlideProps={{ container }}
      variant="temporary"
      {...other}
    >
      {content}
    </Drawer>
  );
};

export default InvoiceListSidebar;
