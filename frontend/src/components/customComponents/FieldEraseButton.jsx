import Eraser from "../SVG/Eraser";

export default function FieldEraseButton({ className, isHidden, onClick }) {
  return (
    <button
      className={className}
      type="button"
      hidden={isHidden}
      onClick={onClick}
    >
      <Eraser />
    </button>
  );
}
