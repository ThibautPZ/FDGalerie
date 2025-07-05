import { flexRender } from "@tanstack/react-table";
import tranlationInstance from "../../services/translationInstance";

function ContactManagementList({ tableObj }) {
  const tCommonTable = tranlationInstance("common:table");

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
          {tableObj.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
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
          {tableObj.getRowModel().rows.map((row) => (
            <tr key={row.id} onClick={row.getToggleSelectedHandler()}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {tableObj.getFooterGroups().map((footerGroup) => (
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
