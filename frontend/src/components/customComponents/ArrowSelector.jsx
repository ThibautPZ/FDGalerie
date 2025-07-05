import ArrowDownCircle from "../SVG/ArrowDownCircle";
import ArrowUpCircle from "../SVG/ArrowUpCircle";

export default function ArrowSelector({
  labelText,
  whenLabel,
  isFolded,
  setIsFolded,
  onOpen,
  onClose,
}) {
  const handleSelectorClick = () => {
    if (!isFolded && onClose) {
      if (onClose.condition) {
        console.warn(onClose.condition);
      }
    }
    if (isFolded && onOpen) {
      if (onOpen.condition) {
        console.warn(onOpen.condition);
      }
    }
    setIsFolded(!isFolded);
  };

  const shouldRenderLabel = () => {
    if (!labelText || !whenLabel) {
      return false;
    }
    if (whenLabel === "always") {
      return true;
    }
    if (isFolded && whenLabel === "folded") {
      return true;
    }
    if (!isFolded && whenLabel === "unfolded") {
      return true;
    }
    return false;
  };
  return (
    <>
      {shouldRenderLabel() && <span>{labelText}</span>}

      <button type="button" onClick={handleSelectorClick}>
        {isFolded ? <ArrowDownCircle /> : <ArrowUpCircle />}
      </button>
    </>
  );
}
