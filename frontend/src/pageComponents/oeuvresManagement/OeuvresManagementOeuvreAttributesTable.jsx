import { useEffect, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import tranlationInstance from "../../services/translationInstance";
import {
  isArrayNotEmpty,
  isString,
} from "../../services/typesAndValidationChecks";
import TableCore from "../../components/reactTable/TableCore";
import {
  defaultCellCb,
  giveLimitedTextCellCb,
} from "../../helpers/reactTable/cellCb";
import {
  filterByDateRange,
  filterByImagePresence,
  filterByNumberRange,
} from "../../helpers/reactTable/filterFunctions";
import OeuvresManagementAttributesTableFilters from "./OeuvresManagementOeuvreAttributesTableFilters";

/* eslint-disable prefer-destructuring */
const giveJsonKey = (column) => {
  const language = column.id.split("_")[1];
  return `json${language}`;
};

const translatedNameCellCb = ({ column, row, table }) => {
  const { json } = table.options.meta;
  const untranslatedName = row.original.name;
  const key = giveJsonKey(column);
  const value = json[key][untranslatedName].name;
  return value || "-";
};

const translatedDescriptionCellCb = ({ column, row, table }) => {
  const { json } = table.options.meta;
  const untranslatedName = row.original.name;
  const key = giveJsonKey(column);
  const value = json[key][untranslatedName].description;
  if (!value) {
    return "-";
  }
  if (value.length > 24) {
    return `${value.substring(0, 24)}...`;
  }
  return value;
};

const fallbackData = [];
const columnHelper = createColumnHelper();
export default function OeuvreManagementOeuvreAttributesTable({
  attributeData,
  jsonData,
  tableColumns,
  emptyDataText,
  className,
  attribute,
  t,
  setIsFolded,
}) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

  const tPageText = tranlationInstance(
    "pageText:OeuvresManagement.OMAttributes"
  );

  const giveAccessor = (colName, tKey, options, cellCb) => {
    const colId = isString(colName) ? colName : colName.join("_");
    const headerText = t(...tKey);
    const addedEntries = { enableSorting: false };

    const cellCbObj = {
      translatedNameCellCb,
      translatedDescriptionCellCb,
      descriptionCellCb: giveLimitedTextCellCb(24),
    };

    const assignToAddedEntries = (assigned) => {
      return Object.assign(addedEntries, assigned);
    };

    const giveRowData = (row) => {
      if (isString(colName)) {
        return row[colName];
      }
      if (isArrayNotEmpty(colName)) {
        const [key, subKey] = colName;
        if (key === "name" || key === "description") {
          const untranslatedName = row.name;
          const dataKey = `json${subKey}`;
          return jsonData[dataKey][untranslatedName][key] || "-";
        }
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

    if (options?.filtering) {
      assignToAddedEntries({ enableFiltering: true });
      if (options.filtering.filterFn) {
        assignToAddedEntries({ filterFn: options.filtering.filterFn });
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
    data: attributeData ?? fallbackData,
    state: { sorting, rowSelection, columnFilters },
    filterFns: {
      filterByImagePresence,
      filterByNumberRange,
      filterByDateRange,
    },
    meta: { json: jsonData },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange,
  });

  useEffect(() => {
    if (Object.keys(rowSelection)[0]) {
      setIsFolded(true);
      navigate(
        `${attribute}:${table.getRow(Object.keys(rowSelection)[0]).original.id}`
      );
    }
  }, [Object.keys(rowSelection)[0]]);

  if (!isArrayNotEmpty(attributeData)) {
    return <div>{emptyDataText}</div>;
  }

  return (
    <div className={className}>
      <h1>{t("title")}</h1>
      <OeuvresManagementAttributesTableFilters
        tableData={table}
        t={tPageText}
      />
      <TableCore tableObj={table} />
    </div>
  );
}
