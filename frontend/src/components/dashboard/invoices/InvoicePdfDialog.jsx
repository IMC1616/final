import PropTypes from 'prop-types';
import { PDFViewer } from '@react-pdf/renderer';
import ArrowLeftIcon from '../../../icons/ArrowLeft';
import { Box, Button, Dialog, SvgIcon } from '@mui/material';
import { InvoicePdfDocument } from './InvoicePdfDocument';

export const InvoicePdfDialog = (props) => {
  const { invoice, onClose, open = false, ...other } = props;

  if (!invoice) {
    return null;
  }

  return (
    <Dialog
      fullScreen
      open={open}
      {...other}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 2
          }}
        >
          <Button
            color="inherit"
            startIcon={(
              <SvgIcon>
                <ArrowLeftIcon />
              </SvgIcon>
            )}
            onClick={onClose}
          >
            Cerrar
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <PDFViewer
            height="100%"
            style={{ border: 'none' }}
            width="100%"
          >
            <InvoicePdfDocument invoice={invoice} />
          </PDFViewer>
        </Box>
      </Box>
    </Dialog>
  );
};

InvoicePdfDialog.propTypes = {
  // @ts-ignore
  invoice: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
