import FetchImage from "./Image";

export default function PaintingThumbLg({ fileName, className }) {
  const url = fileName
    ? `${import.meta.env.VITE_BACKEND_URL}${
        import.meta.env.VITE_PAINTINGS_THUMB_LG_PATH
      }/${fileName}_lg.jpg`
    : null;

  return (
    <div className={className || ""}>
      <FetchImage url={url} name={`${fileName}thummb_lg`} />
    </div>
  );
}
