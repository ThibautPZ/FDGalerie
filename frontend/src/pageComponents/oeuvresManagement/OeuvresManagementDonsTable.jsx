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
export default function OeuvresManagementDonsTable({ donsList }) {
  const navigate = useNavigate();
  const { setIsModifying } = useOutletContext();
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const [tCommon, tCommonInfo, tPageText] = tranlationInstance(
    "common",
    "common:info",
    "pageText:OeuvresManagement.OMDons"
  );

  const giveAccessor = (colName, tKey, options, cellCb) => {
    const colId = isString(colName) ? colName : colName.join("_");
    const headerText = tCommonInfo(...tKey);
    const addedEntries = { enableSorting: false };

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
      cell: cellCb || defaultCellCb,
      header: headerText,
      ...addedEntries,
      // sortingFn:
      // footer: (props) => props.column.id,
    });
    return col;
  };

  const ownerCellCb = ({ row }) => {
    const { firstName, lastName, userId, contactId } = row.original;
    const ownerStatus = userId
      ? `${tCommonInfo("userId")} ${userId}`
      : `${tCommonInfo("contactId")} ${contactId}`;
    return `${firstName} ${lastName} (${ownerStatus})`;
  };

  const dateCellCb = giveDateCellCb(tCommon);

  const defaultColumns = [
    giveAccessor("image", ["preview"], null, thumbMdCellCb),
    giveAccessor("paintingTitle", ["oeuvreTitle"], { sorting: true }),
    giveAccessor(
      ["firstName", "lastName"],
      ["ownerName"],
      { sorting: true },
      ownerCellCb
    ),
    giveAccessor("date", ["date"], { sorting: true }, dateCellCb),
    giveAccessor("giftNumber", ["giftNumber"], { sorting: true }),
    giveAccessor("paintingId", ["paintingId"], { sorting: true }),
  ];

  const onRowSelectionChange = (stateCb) => {
    return setRowSelection(stateCb);
  };
  const table = useReactTable({
    columns: defaultColumns,
    data: donsList ?? fallbackData,
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
  if (!isArrayNotEmpty(donsList)) {
    return <div>{tPageText("noDons")}</div>;
  }
  return (
    <div className="OeuvresManagementDonsList">
      <TableCore tableObj={table} />
    </div>
  );
}
