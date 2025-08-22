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

import { isArrayNotEmpty } from "../../services/typesAndValidationChecks";
import TableCore from "../../components/reactTable/TableCore";
import {
  defaultCellCb,
  giveTextFieldsCellCb,
  giveTranslationCellCb,
  giveTranslationFromNameCellCb,
  giveYesNoCellCb,
  thumbMdCellCb,
} from "../../helpers/reactTable/cellCb";
import {
  filterArrByArr,
  filterValueByArr,
  filterByImagePresence,
} from "../../helpers/reactTable/filterFunctions";
import OeuvresListFilters from "./OeuvresListFilters";

const fallbackData = [];
const columnHelper = createColumnHelper();

const artistCommentCellCb = giveTextFieldsCellCb(
  {
    colName: "artistCommentFr",
    title: "Fr",
    textLimit: 24,
  },
  {
    colName: "artistCommentEnUS",
    title: "EnUS",
    textLimit: 24,
  },
  {
    colName: "artistCommentEnGB",
    title: "EnGB",
    textLimit: 24,
  }
);

function OeuvresManagementOeuvresList({
  oeuvresList,
  techniques,
  families,
  formats,
  supports,
  setIsModifying,
}) {
  const navigate = useNavigate();
  const [
    tCommon,
    tCommonInfo,
    tTechniques,
    tSupports,
    tFormats,
    tFamilies,
    tAvailability,
    tPageText,
  ] = tranlationInstance(
    "common",
    "common:info",
    "techniques",
    "supports",
    "paintingSizes",
    "families",
    "common:oeuvreAvailability",
    "pageText:OeuvresManagement.OMOeuvresList"
  );

  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

  const techniqueCellCb = (info) => {
    const techniquesArr = info.getValue();
    if (!isArrayNotEmpty(techniquesArr)) {
      return "-";
    }
    return techniquesArr.reduce(
      (str, techniqueKey, index) => {
        if (index > 0) {
          return `${str}, ${tTechniques(`${techniqueKey}.name`)}`;
        }
        return str;
      },
      tTechniques(`${techniquesArr[0]}.name`)
    );
  };

  const formatCellCb = ({ row }) => {
    const { original } = row;
    const { format, width, height } = original;
    return `${tFormats(`${format}.name`)}
   ${width} x ${height} ${tCommonInfo("cm")}`;
  };

  const availabilityCellCb = giveTranslationCellCb(tAvailability);
  const visibilityCellCb = giveYesNoCellCb(tCommon);
  const supportCellCb = giveTranslationFromNameCellCb(tSupports);
  const familyCellCb = giveTranslationFromNameCellCb(tFamilies);

  const giveAccessor = (colName, tKey, options, cellCb) => {
    const headerText = tCommonInfo(...tKey);
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
    if (options?.filtering) {
      assignToAddedEntries({ enableFiltering: true });

      if (options.filtering.filterFn) {
        assignToAddedEntries({ filterFn: options.filtering.filterFn });
      }
    }

    const col = columnHelper.accessor((row) => row[colName], {
      id: colName,
      cell: cellCb || defaultCellCb,
      header: headerText,
      ...addedEntries,

      // footer: (props) => props.column.id,
    });
    return col;
  };
  const defaultColumns = [
    giveAccessor(
      "image",
      ["preview"],
      { filtering: { filterFn: "filterByImagePresence" } },
      thumbMdCellCb
    ),
    giveAccessor("title", ["oeuvreTitle"], { sorting: true }),
    giveAccessor(
      "techniques",
      ["oeuvreTechnique"],
      { filtering: { filterFn: "filterArrByArr" } },
      techniqueCellCb
    ),
    giveAccessor(
      "support",
      ["oeuvreSupport"],
      { sorting: true, filtering: { filterFn: "filterValueByArr" } },
      supportCellCb
    ),
    giveAccessor(
      "format",
      ["oeuvreFormat"],
      { sorting: true, filtering: { filterFn: "filterValueByArr" } },
      formatCellCb
    ),
    giveAccessor(
      "family",
      ["oeuvreFamily"],
      { sorting: true, filtering: { filterFn: "filterValueByArr" } },
      familyCellCb
    ),
    giveAccessor(
      "artistCommentFr",
      ["artistComment"],
      { sorting: true },
      artistCommentCellCb
    ),
    giveAccessor(
      "availabilityName",
      ["availability"],
      { sorting: true, filtering: { filterFn: "filterValueByArr" } },
      availabilityCellCb
    ),
    giveAccessor(
      "publiclyVisible",
      ["publiclyVisible"],
      { sorting: true, filtering: { filterFn: "equals" } },
      visibilityCellCb
    ),
  ];

  const onRowSelectionChange = (stateCb) => {
    return setRowSelection(stateCb);
  };

  const table = useReactTable({
    columns: defaultColumns,
    data: oeuvresList ?? fallbackData,
    state: { sorting, rowSelection, columnFilters },
    filterFns: { filterArrByArr, filterValueByArr, filterByImagePresence },
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
      navigate(
        `/management/oeuvres/id:${table.getRow(Object.keys(rowSelection)[0]).original.id}`
      );
      setIsModifying(false);
    }
  }, [Object.keys(rowSelection)[0]]);

  return (
    <div className="OeuvresManagementOeuvresList">
      <OeuvresListFilters
        tableData={table}
        techniques={techniques}
        families={families}
        formats={formats}
        supports={supports}
      />
      {!isArrayNotEmpty(oeuvresList) ? (
        <p>{tPageText("noOeuvres")}</p>
      ) : (
        <TableCore tableObj={table} />
      )}
    </div>
  );
}
export default OeuvresManagementOeuvresList;
