import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF", // Lighter background
    padding: 10,
    paddingTop: 30, // Ensure padding top is not too much
  },
  section: {
    marginTop: 10,
    padding: 10,
  },
  table: {
    display: "table",
    width: "auto", // Ensure table uses auto width to fit content
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    // This might need adjustment to fit more columns horizontally
    width: "20%", // Adjust based on the number of columns
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    margin: "auto",
    fontSize: 10,
  },
});

const RenderTable = ({ columns, data }) => (
  <View style={styles.table}>
    <View style={styles.tableRow}>
      {columns.map((col) => (
        <View key={col.accessorKey} style={styles.tableCol}>
          <Text style={styles.tableCell}>{col.header}</Text>
        </View>
      ))}
    </View>
    {data.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.tableRow}>
        {columns.map((col, colIndex) => (
          <View key={colIndex} style={styles.tableCol}>
            <Text style={styles.tableCell}>{row[col.accessorKey]}</Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);

// The main document component
const TablePDF = ({ title, columns, data }) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Text>{title}</Text>
        </View>
        <RenderTable columns={columns} data={data} />
      </Page>
    </Document>
  );
};

export default TablePDF;
