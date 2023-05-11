import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const SeverityPillRoot = styled("span")(({ theme, ownerState }) => {
  console.log(
    "🚀 ~ file: severityPill.jsx:5 ~ SeverityPillRoot ~ ownerState:",
    ownerState
  );
  const backgroundColor = theme.palette[ownerState.color].main;
  console.log(
    "🚀 ~ file: severityPill.jsx:6 ~ SeverityPillRoot ~ backgroundColor:",
    backgroundColor
  );
  const color =
    theme.palette.mode === "dark"
      ? theme.palette[ownerState.color].contrastText
      : theme.palette[ownerState.color].contrastText;
  console.log(
    "🚀 ~ file: severityPill.jsx:9 ~ SeverityPillRoot ~ color:",
    color
  );

  return {
    alignItems: "center",
    backgroundColor,
    borderRadius: 12,
    color,
    cursor: "default",
    display: "inline-flex",
    flexGrow: 0,
    flexShrink: 0,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(12),
    lineHeight: 2,
    fontWeight: 600,
    justifyContent: "center",
    letterSpacing: 0.5,
    minWidth: 20,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
});

const SeverityPill = (props) => {
  const { color = "primary", children, ...other } = props;

  const ownerState = { color };

  return (
    <SeverityPillRoot ownerState={ownerState} {...other}>
      {children}
    </SeverityPillRoot>
  );
};

SeverityPill.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "error",
    "info",
    "warning",
    "success",
  ]),
};

export default SeverityPill;
