import { isArrayNotEmpty } from "../../services/typesAndValidationChecks";

export default function OwningPaintingsWrapper({
  paintingsList,
  fallbackText,
  children,
}) {
  if (!isArrayNotEmpty(paintingsList)) {
    return <p>{fallbackText}</p>;
  }

  return children;
}
