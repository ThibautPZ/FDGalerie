export default function formatStringFromDb(string) {
  return (
    string.slice(0, 1).toLocaleUpperCase() +
    string.slice(1).replaceAll("_", " ")
  );
}
