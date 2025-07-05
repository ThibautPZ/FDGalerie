export default function TableCell({ cellValue }) {
  if (!cellValue) {
    return <div>-</div>;
  }
  return <div>{cellValue}</div>;
}
