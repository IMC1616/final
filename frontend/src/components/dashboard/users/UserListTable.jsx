import React, { useMemo, useState, useEffect } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
  } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import MaterialReactTable from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useGetUsersQuery } from "../../../services/endpoints/users";

const UserListTable = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const queryString = useMemo(() => {
    const sort = sorting.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",") || "asc";
    const offset = pagination.pageIndex * pagination.pageSize;
    const limit = pagination.pageSize;
    const select = "name,lastName,email,mobile,role";
    const filters = columnFilters.map((filter) => `${filter.id}=${filter.value}`).join("&");

    const url = `/users?offset=${offset}&limit=${limit}&sort=${sort}&select=${select}&${filters}`;

    return url;
  }, [pagination, sorting, columnFilters]);

  const { isLoading, isFetching, isSuccess, data: fetchedData,isError } = useGetUsersQuery(queryString);

  useEffect(() => {
    if (isSuccess) {
      setData(fetchedData.data.users);
      setRowCount(fetchedData.data.totalPages);
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
        Cell: ({ renderedCellValue, row }) => (
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
        accessorKey: "mobile",
        header: "Celular",
      },
      {
        accessorKey: "role",
        header: "Role",
        filterVariant: 'multi-select',
        filterSelectOptions: ["admin", "user"],
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      displayColumnDefOptions={{
        'mrt-row-actions': {
          muiTableHeadCellProps: {
            align: 'center',
          },
          size: 120,
        },
      }}
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
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Tooltip arrow placement="left" title="Edit">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="right" title="Delete">
            <IconButton color="error" onClick={() => {}}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    />
  );
};

export default UserListTable;
