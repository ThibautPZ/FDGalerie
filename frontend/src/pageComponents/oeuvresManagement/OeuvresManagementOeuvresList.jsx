import { useEffect, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import tranlationInstance from "../../services/translationInstance";
import PaintingThumbMd from "../../components/image/PaintingThumbMd";
import {
  isArrayNotEmpty,
  isStringNotEmpty,
} from "../../services/typesAndValidationChecks";
import TableCore from "../../components/reactTable/TableCore";

const fallbackData = [];
const columnHelper = createColumnHelper();

const thumbMdCellCb = ({ row }) => {
  const { original } = row;
  const { fileName } = original;
  return PaintingThumbMd({
    fileName,
    className: "PaintingThumbMd",
  });
};

const artistCommentCellCb = (info) => {
  const value = info.getValue();
  let comment = isStringNotEmpty(value) ? value : "-";
  if (comment.length > 24) {
    comment = `${comment.substring(0, 24)}...`;
  }
  return comment;
};

const giveTranslatedCellCb = (t) => {
  return (info) => {
    const value = info.getValue();
    return value ? t(`${value}.name`) : "-";
  };
};

function OeuvresManagementOeuvresList({ oeuvresList, setIsModifying }) {
  const navigate = useNavigate();
  const [
    tCommon,
    tCommonInfo,
    tTechniques,
    tSupports,
    tFormats,
    tFamilies,
    tAvailability,
  ] = tranlationInstance(
    "common",
    "common:info",
    "techniques",
    "supports",
    "paintingSizes",
    "families",
    "common:oeuvreAvailability"
  );

  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

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

  const availabilityCellCb = (info) => {
    const availability = info.getValue();
    return tAvailability(availability);
  };

  const visibilityCellCb = (info) => {
    const visibility = info.getValue();
    return visibility ? tCommon("yes") : tCommon("no");
  };

  const supportCellCb = giveTranslatedCellCb(tSupports);
  const familyCellCb = giveTranslatedCellCb(tFamilies);

  const giveAccessor = (colName, tKey, options, cellCb) => {
    const headerText = tCommonInfo(...tKey);
    const addedEntries = { enableSorting: false };
    const defaultCellCb = (info) => info.getValue() || "-";

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
      cell: cellCb || defaultCellCb,
      header: headerText,
      ...addedEntries,
      // sortingFn:
      // footer: (props) => props.column.id,
    });
    return col;
  };
  const defaultColumns = [
    giveAccessor("image", ["preview"], null, thumbMdCellCb),
    giveAccessor("title", ["oeuvreTitle"], { sorting: true }),
    giveAccessor("techniques", ["oeuvreTechnique"], null, techniqueCellCb),
    giveAccessor(
      "support",
      ["oeuvreSupport"],
      { sorting: true },
      supportCellCb
    ),
    giveAccessor("format", ["oeuvreFormat"], { sorting: true }, formatCellCb),
    giveAccessor("family", ["oeuvreFamily"], { sorting: true }, familyCellCb),
    giveAccessor(
      "artistComment",
      ["artistComment"],
      { sorting: true },
      artistCommentCellCb
    ),
    giveAccessor(
      "availabilityName",
      ["availability"],
      { sorting: true },
      availabilityCellCb
    ),
    giveAccessor(
      "publiclyVisible",
      ["publiclyVisible"],
      { sorting: true },
      visibilityCellCb
    ),
  ];

  const onRowSelectionChange = (stateCb) => {
    return setRowSelection(stateCb);
  };
  const table = useReactTable({
    columns: defaultColumns,
    data: oeuvresList ?? fallbackData,
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
      navigate(`id:${table.getRow(Object.keys(rowSelection)[0]).original.id}`);
      setIsModifying(false);
    }
  }, [Object.keys(rowSelection)[0]]);

  return (
    <div className="OeuvresManagementOeuvresList">
      <TableCore tableObj={table} />
    </div>
  );
}
export default OeuvresManagementOeuvresList;
