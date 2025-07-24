import { ErrorBoundary } from "react-error-boundary";

import ReactImage from "../../components/image/ReactImage";
import TableCell from "../../components/reactTable/TableCell";
import FallbackImg from "../../components/image/FallbackImg";

export default function OwningPaintingTableCell({ cellValue, colName }) {
  if (colName === "pathname") {
    return (
      <div className="OwningPaintingTableCell">
        <ErrorBoundary fallback={<FallbackImg />}>
          <ReactImage
            srcList={`${import.meta.env.VITE_BACKEND_URL}${
              import.meta.env.VITE_PAINTINGS_PATH
            }/${cellValue}`}
          />
        </ErrorBoundary>
      </div>
    );
  }
  return (
    <div>
      <TableCell cellValue={cellValue} />
    </div>
  );
}
