import { useEffect, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useNavigate, useOutletContext } from "react-router-dom";

import tranlationInstance from "../../services/translationInstance";
import {
  isArrayNotEmpty,
  isString,
} from "../../services/typesAndValidationChecks";
import TableCore from "../../components/reactTable/TableCore";
import {
  defaultCellCb,
  giveDateCellCb,
  thumbMdCellCb,
} from "../../helpers/reactTable/cellCb";

const fallbackData = [];
const columnHelper = createColumnHelper();

export default function OeuvresManagementTransactionTable({
  tableData,
  tableColumns,
  emptyDataText,
  className,
}) {
  const navigate = useNavigate();
  const { setIsModifying } = useOutletContext();
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const [tCommon, tCommonInfo] = tranlationInstance("common", "common:info");

  const giveAccessor = (colName, tKey, options, cellCb) => {
    const colId = isString(colName) ? colName : colName.join("_");
    const headerText = tCommonInfo(...tKey);
    const addedEntries = { enableSorting: false };

    const cellCbObj = {
      ownerCellCb: ({ row }) => {
        const { firstName, lastName, userId, contactId } = row.original;
        const ownerStatus = userId
          ? `${tCommonInfo("userId")} ${userId}`
          : `${tCommonInfo("contactId")} ${contactId}`;
        return `${firstName} ${lastName} (${ownerStatus})`;
      },

      dateCellCb: giveDateCellCb(tCommon),
      thumbMdCellCb,
    };

    const assignToAddedEntries = (assigned) => {
      return Object.assign(addedEntries, assigned);
    };

    const giveRowData = (row) => {
      if (isString(colName)) {
        return row[colName];
      }
      if (isArrayNotEmpty(colName)) {
        const values = colName.map((col) => row[col]);
        return values.join(" ");
      }
      return "-";
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

    const col = columnHelper.accessor(giveRowData, {
      id: colId,
      cell: cellCb ? cellCbObj[cellCb] : defaultCellCb,
      header: headerText,
      ...addedEntries,
      // sortingFn:
      // footer: (props) => props.column.id,
    });
    return col;
  };

  const defaultColumns = tableColumns.map(
    ({ colName, tKey, options, cellCb }) =>
      giveAccessor(colName, tKey, options, cellCb)
  );

  const onRowSelectionChange = (stateCb) => {
    return setRowSelection(stateCb);
  };
  const table = useReactTable({
    columns: defaultColumns,
    data: tableData ?? fallbackData,
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
        `id:${table.getRow(Object.keys(rowSelection)[0]).original.paintingId}`
      );
      setIsModifying(false);
    }
  }, [Object.keys(rowSelection)[0]]);

  if (!isArrayNotEmpty(tableData)) {
    return <div>{emptyDataText}</div>;
  }

  return (
    <div className={className}>
      <TableCore tableObj={table} />
    </div>
  );
}
