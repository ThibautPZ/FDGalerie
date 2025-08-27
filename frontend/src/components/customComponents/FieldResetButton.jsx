import ResetArrow from "../SVG/ResetArrow";

export default function FieldResetButton({ className, isHidden, onClick }) {
  return (
    <button
      className={className}
      type="button"
      hidden={isHidden}
      onClick={onClick}
    >
      <ResetArrow />
    </button>
  );
}
