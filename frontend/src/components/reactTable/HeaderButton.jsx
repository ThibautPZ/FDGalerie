export default function HeaderButton({ headerData }) {
  const { column } = headerData;
  const handleClick = () => {
    console.log(headerData);
    const toggleSorting = column.toggleSorting;
    console.log(toggleSorting);
  };
  return (
    <button type="button" onClick={handleClick}>
      {column.columnDef.header}
    </button>
  );
}
