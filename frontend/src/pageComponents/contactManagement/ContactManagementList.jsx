import { useEffect, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import tranlationInstance from "../../services/translationInstance";

const fallbackData = [];
const columnHelper = createColumnHelper();

function ContactManagementList({ contactList, setIsModifying }) {
  const navigate = useNavigate();
  const [tCommonInfo, tCommonTable] = tranlationInstance(
    "common:info",
    "common:table"
  );

  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const giveAccessor = (colName, tKey, options) => {
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

    const col = columnHelper.accessor((row) => row[colName], {
      id: colName,
      cell: (info) => info.getValue() || "-",
      header: headerText,
      ...addedEntries,
      // sortingFn:
      // footer: (props) => props.column.id,
    });
    return col;
  };
  const defaultColumns = [
    giveAccessor("contactId", ["contactId"], { sorting: { desc: true } }),
    giveAccessor("lastname", ["lastname"], { sorting: true }),
    giveAccessor("firstname", ["firstname"], { sorting: true }),
    giveAccessor("address", ["address"], { sorting: true }),
    giveAccessor("postalCode", ["postalCode"], { sorting: true }),
    giveAccessor("city", ["city"], { sorting: true }),
    giveAccessor("email", ["email"], { sorting: true }),
    giveAccessor("phoneNumber1", ["phoneNumber", { number: 1 }]),
    giveAccessor("phoneNumber2", ["phoneNumber", { number: 2 }]),
    giveAccessor("language", ["spokenLanguage"], { sorting: true }),

    giveAccessor("creationDate", ["creationDate"], { sorting: true }),
  ];

  const onRowSelectionChange = (stateCb) => {
    return setRowSelection(stateCb);
  };
  const table = useReactTable({
    columns: defaultColumns,
    data: contactList ?? fallbackData,
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
        `id:${table.getRow(Object.keys(rowSelection)[0]).original.contactId}`
      );
      setIsModifying(false);
    }
  }, [Object.keys(rowSelection)[0]]);

  const giveHeaderTitle = (headerColumnData) => {
    if (!headerColumnData.getCanSort()) {
      return null;
    }
    if (headerColumnData.getNextSortingOrder() === "asc") {
      return tCommonTable("sortAscending");
    }
    if (headerColumnData.getNextSortingOrder() === "desc") {
      return tCommonTable("sortDescending");
    }
    return tCommonTable("clearSort");
  };

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    // <HeaderButton headerData={header} />
                    <div
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyDown={header.column.getToggleSortingHandler()}
                      title={giveHeaderTitle(header.column)}
                      role="button"
                      tabIndex={0}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              // onClick={() => console.log(row)}
              onClick={row.getToggleSelectedHandler()}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}
export default ContactManagementList;
