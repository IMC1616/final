import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { useGetReconnectionsQuery } from "../../../services/endpoints/reconnections";
import ReconnectionModal from "./ReconnectionModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  closeModal,
  openModal,
  selectShowModal,
  selectModalType,
  selectModalComponent,
} from "../../../features/modal/modalSlice";

const ReconnectionListTable = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const showModal = useSelector(selectShowModal);
  const modalType = useSelector(selectModalType);
  const modalComponent = useSelector(selectModalComponent);

  const queryString = useMemo(() => {
    const sort =
      sorting.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",") || "asc";
    const offset = pagination.pageIndex * pagination.pageSize;
    const limit = pagination.pageSize;
    const select = "name,amount";
    const filters = columnFilters
      .map((filter) => `${filter.id}=${filter.value}`)
      .join("&");

    const url = `/reconnections?offset=${offset}&limit=${limit}&sort=${sort}&select=${select}&${filters}`;

    return url;
  }, [pagination, sorting, columnFilters]);

  const {
    isLoading,
    isFetching,
    isSuccess,
    data: fetchedData,
    isError,
  } = useGetReconnectionsQuery(queryString);

  useEffect(() => {
    if (isSuccess) {
      setData(fetchedData.data.reconnections);
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
        accessorKey: "amount",
        header: "Precio de reconexión",
      },
    ],
    []
  );

  const handleEditRow = useCallback(
    (row) => {
      dispatch(
        openModal({
          component: "reconnection",
          type: "edit",
          data: row.original,
        })
      );
    },
    [dispatch]
  );

  const handleDeleteRow = useCallback(
    (row) => {
      dispatch(
        openModal({
          component: "reconnection",
          type: "delete",
          data: row.original,
        })
      );
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
            <Tooltip arrow placement="top" title="Editar">
              <IconButton onClick={() => handleEditRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title="Eliminar">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
      <ReconnectionModal
        isOpen={
          showModal &&
          modalComponent === "reconnection" &&
          modalType !== "delete"
        }
        handleClose={handleCloseModal}
      />
      <DeleteConfirmationModal
        open={
          showModal &&
          modalComponent === "reconnection" &&
          modalType === "delete"
        }
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default ReconnectionListTable;
