import PropTypes from "prop-types";
import { List, ListSubheader } from "@mui/material";
import NavItem from "./NavItem";

const NavSection = (props) => {
  const { items, pathname, isPathActive, title, ...other } = props;

  return (
    <List
      subheader={
        <ListSubheader
          disableGutters
          disableSticky
          sx={{
            color: "text.primary",
            fontSize: "0.75rem",
            lineHeight: 2.5,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {title}
        </ListSubheader>
      }
      {...other}
    >
      {items.map((item) => {
        const active = isPathActive(item.path);

        return (
          <NavItem
            active={active}
            depth={0}
            icon={item.icon}
            info={item.info}
            key={item.title}
            path={item.path}
            title={item.title}
          />
        );
      })}
    </List>
  );
};

NavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  isPathActive: PropTypes.func,
  title: PropTypes.string,
};

export default NavSection;
