import FetchImage from "./Image";

export default function PaintingThumbMd({ fileName, className }) {
  const url = fileName
    ? `${import.meta.env.VITE_BACKEND_URL}${
        import.meta.env.VITE_PAINTINGS_THUMB_MD_PATH
      }/${fileName}_md.jpg`
    : null;

  return (
    <div className={className || ""}>
      <FetchImage url={url} name={`${fileName}thummb_md`} />
    </div>
  );
}
