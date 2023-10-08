import { useMemo } from "react";
import PropTypes from "prop-types";
import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import numeral from "numeral";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useTheme } from "@mui/material/styles";
import { statusMap } from "../../../constants";

const useStyles = () => {
  const theme = useTheme();

  return useMemo(() => {
    return StyleSheet.create({
      page: {
        backgroundColor: "#FFFFFF",
        padding: 24,
      },
      h4: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.235,
      },
      h6: {
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.6,
      },
      alignRight: {
        textAlign: "right",
      },
      subtitle2: {
        fontSize: 10,
        fontWeight: 500,
        lineHeight: 1.57,
      },
      body2: {
        fontSize: 10,
        fontWeight: 400,
        lineHeight: 1.43,
      },
      gutterBottom: {
        marginBottom: 4,
      },
      colorSuccess: {
        color: theme.palette.success.main,
      },
      uppercase: {
        textTransform: "uppercase",
      },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
      },
      brand: {
        height: 32,
        width: 32,
      },
      references: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 32,
      },
      items: {
        marginTop: 32,
      },
      itemRow: {
        borderBottomWidth: 1,
        borderColor: "#EEEEEE",
        borderStyle: "solid",
        flexDirection: "row",
      },
      itemNumber: {
        padding: 6,
        width: "10%",
      },
      itemDescription: {
        padding: 6,
        width: "50%",
      },
      itemDate: {
        padding: 6,
        width: "25%",
      },
      itemTotalAmount: {
        padding: 6,
        width: "15%",
      },
      summaryRow: {
        flexDirection: "row",
      },
      summaryGap: {
        padding: 6,
        width: "70%",
      },
      summaryTitle: {
        padding: 6,
        width: "15%",
      },
      summaryValue: {
        padding: 6,
        width: "15%",
      },
    });
  }, [theme]);
};

export const InvoicePdfDocument = ({ invoice }) => {
  const styles = useStyles();

  const { user, consumption, totalAmount, paymentStatus } = invoice;

  const monthName = format(parseISO(invoice.invoiceDate), "MMMM", {
    locale: es,
  });

  const paymentDateFormat = format(parseISO(invoice.paymentDate), "dd/MM/yyyy");
  const totalAmountFormatted = numeral(totalAmount).format("0,0.00");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Image source="/logo.png" style={styles.brand} />
            <Text style={styles.h6}>DROP</Text>
          </View>
          <View>
            <Text style={[styles.h4, styles.uppercase, styles.colorSuccess]}>
              {statusMap[paymentStatus].label}
            </Text>
            <Text style={styles.subtitle2}>{invoice._id}</Text>
          </View>
        </View>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={[styles.h4, styles.uppercase]}>RECIBO</Text>
        </View>

        <View>
          <View style={styles.references}>
            <View>
              <Text style={[styles.subtitle2, styles.gutterBottom]}>Socio</Text>
              <Text style={styles.body2}>
                Nombre completo: {user.name} {user.lastName}
              </Text>
              <Text style={styles.body2}>NIT: {user.nit}</Text>
            </View>
            <View>
              <Text style={[styles.subtitle2, styles.gutterBottom]}>
                Consumo
              </Text>
              <Text style={styles.body2}>
                Fecha de lectura:{" "}
                {format(new Date(consumption.readingDate), "dd/MM/yyyy")}
              </Text>
              <Text style={styles.body2}>
                Consumo: {consumption.consumptionCubicMeters} m³
              </Text>
            </View>
            <View>
              <Text style={[styles.subtitle2, styles.gutterBottom]}>
                Medidor
              </Text>
              <Text style={styles.body2}>Código: {consumption.meter.code}</Text>
              <Text style={styles.body2}>
                Categoría: {consumption.meter.category.name}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.items}>
          <View style={styles.itemRow}>
            <View style={styles.itemNumber}>
              <Text style={styles.h6}>#</Text>
            </View>
            <View style={styles.itemDescription}>
              <Text style={styles.h6}>Descripción</Text>
            </View>
            <View style={styles.itemDate}>
              <Text style={styles.h6}>Fecha de pago</Text>
            </View>
            <View style={styles.itemTotalAmount}>
              <Text style={[styles.h6, styles.alignRight]}>Total</Text>
            </View>
          </View>

          <View style={styles.itemRow}>
            <View style={styles.itemNumber}>
              <Text style={styles.body2}>1</Text>
            </View>
            <View style={styles.itemDescription}>
              <Text style={styles.body2}>
                Consumo de agua del mes de {monthName}
              </Text>
            </View>
            <View style={styles.itemDate}>
              <Text style={styles.body2}>{paymentDateFormat}</Text>
            </View>
            <View style={styles.itemTotalAmount}>
              <Text style={[styles.body2, styles.alignRight]}>
                {totalAmountFormatted}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryGap} />
            <View style={styles.summaryTitle}>
              <Text style={styles.body2}>Subtotal</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={[styles.body2, styles.alignRight]}>
                {totalAmountFormatted}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryGap} />
            <View style={styles.summaryTitle}>
              <Text style={styles.body2}>Total</Text>
            </View>
            <View style={styles.summaryValue}>
              <Text style={[styles.body2, styles.alignRight]}>
                {totalAmountFormatted}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              marginTop: 100,
              marginBottom: 10,
              width: "30%",
              borderBottomWidth: 1,
              borderColor: "#000",
            }}
          />
          <Text style={{ ...styles.h6, marginLeft: "50px" }}>
            Sello de Caja
          </Text>
        </View>
      </Page>
    </Document>
  );
};

InvoicePdfDocument.propTypes = {
  // @ts-ignore
  invoice: PropTypes.object.isRequired,
};
