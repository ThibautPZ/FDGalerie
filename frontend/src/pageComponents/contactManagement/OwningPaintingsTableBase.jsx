import { useEffect, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import tranlationInstance from "../../services/translationInstance";
import TableCore from "../../components/reactTable/TableCore";
import OwningPaintingTableCell from "./OwningPaintingTableCell";

const fallbackData = [];
const columnHelper = createColumnHelper();

export default function OwningPaintingsTableBase({ paintingsList, columns }) {
  const navigate = useNavigate();
  const t = tranlationInstance("");

  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const giveAccessor = (colName, tKey, options) => {
    const headerText = tKey ? t(...tKey) : "";
    const addedEntries = { enableSorting: false };

    const assignToAddedEntries = (assigned) => {
      return Object.assign(addedEntries, assigned);
    };
    if (options?.sorting) {
      assignToAddedEntries({ enableSorting: true });
      if (options.sorting.desc) {
        assignToAddedEntries({ sortDescFirst: true });
      }
      if (options.sorting.multi) {
        assignToAddedEntries({ enableMultiSort: true });
      }
      if (options.sorting.invert) {
        assignToAddedEntries({ invertSorting: true });
      }
      if (options.sorting.undefined) {
        assignToAddedEntries({ sortUndefined: sorting.undefined });
      }
    }

    const col = columnHelper.accessor((row) => row[colName], {
      id: colName,
      cell: (info) =>
        OwningPaintingTableCell({
          cellValue: info.getValue(),
          colName,
        }),

      header: headerText,
      ...addedEntries,
    });
    return col;
  };

  const defaultColumns = columns.map((col) => giveAccessor(...col));

  const onRowSelectionChange = (stateCb) => {
    return setRowSelection(stateCb);
  };
  const table = useReactTable({
    columns: defaultColumns,
    data: paintingsList ?? fallbackData,
    state: { sorting, rowSelection },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange,
  });

  useEffect(() => {
    if (Object.keys(rowSelection)[0]) {
      navigate(
        `../../oeuvres/id:${table.getRow(Object.keys(rowSelection)[0]).original.paintingId}`
      );
    }
  }, [Object.keys(rowSelection)[0]]);

  return <TableCore tableObj={table} />;
}
