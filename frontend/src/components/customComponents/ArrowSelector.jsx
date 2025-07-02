import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ArrowDownCircle from "../SVG/ArrowDownCircle";
import ArrowUpCircle from "../SVG/ArrowUpCircle";

function ArrowSelector({
  labelNS,
  whenLabel,
  isFolded,
  setIsFolded,
  onOpen,
  onClose,
}) {
  const { t } = useTranslation(["common", "pageText"]);
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
    if (!labelNS || !whenLabel) {
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
      {shouldRenderLabel() && <span>{t(labelNS)}</span>}

      <button type="button" onClick={handleSelectorClick}>
        {isFolded ? <ArrowDownCircle /> : <ArrowUpCircle />}
      </button>
    </>
  );
}

ArrowSelector.propTypes = {
  labelNS: PropTypes.string,
  isFolded: PropTypes.bool.isRequired,
  setIsFolded: PropTypes.func.isRequired,
};

ArrowSelector.defaultProps = {
  labelNS: null,
};

export default ArrowSelector;
