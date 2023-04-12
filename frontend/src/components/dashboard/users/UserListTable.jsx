import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { useGetUsersQuery } from "../../../services/endpoints/users";
import UserModal from "./UserModal";
import {
  closeModal,
  openModal,
  selectShowModal,
} from "../../../features/users/userModalSlice";

const UserListTable = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const showModal = useSelector(selectShowModal);

  const queryString = useMemo(() => {
    const sort =
      sorting.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",") || "asc";
    const offset = pagination.pageIndex * pagination.pageSize;
    const limit = pagination.pageSize;
    const select = "name,lastName,email,phone,role";
    const filters = columnFilters
      .map((filter) => `${filter.id}=${filter.value}`)
      .join("&");

    const url = `/users?offset=${offset}&limit=${limit}&sort=${sort}&select=${select}&${filters}`;

    return url;
  }, [pagination, sorting, columnFilters]);

  const {
    isLoading,
    isFetching,
    isSuccess,
    data: fetchedData,
    isError,
  } = useGetUsersQuery(queryString);

  useEffect(() => {
    if (isSuccess) {
      setData(fetchedData.data.users);
      setRowCount(fetchedData.data.totalRecords);
    }
  }, [isSuccess, fetchedData]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "Id",
      },
      {
        accessorKey: "name",
        header: "Nombre",
      },
      {
        accessorKey: "lastName",
        header: "Apellidos",
      },
      {
        accessorKey: "email",
        header: "Correo",
        Cell: ({ renderedCellValue }) => (
          <Chip
            size="small"
            label={renderedCellValue}
            color="info"
            variant="outlined"
            onClick={() => window.open(`mailto:${renderedCellValue}`)}
          />
        ),
      },
      {
        accessorKey: "phone",
        header: "Celular",
      },
      {
        accessorKey: "role",
        header: "Role",
        filterVariant: "multi-select",
        filterSelectOptions: ["admin", "user"],
      },
    ],
    []
  );

  const handleEditRow = useCallback(
    (row) => {
      dispatch(openModal({ type: "edit", data: row.original }));
    },
    [dispatch]
  );

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return (
    <>
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
          columnVisibility: { _id: false, mobile: false },
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
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 50,
          },
        }}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              flexWrap: "nowrap",
              justifyContent: "center",
            }}
          >
            <Tooltip arrow placement="top" title="Edit">
              <IconButton onClick={() => handleEditRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
      <UserModal isOpen={showModal} handleClose={handleCloseModal} />
    </>
  );
};

export default UserListTable;
