import { useState } from "react";

import ArrowSelector from "./customComponents/ArrowSelector";

function FoldableComponent({
  className,
  labelNS,
  isOpen,
  whenLabel,
  onOpen,
  onClose,
  children,
}) {
  const [isFolded, setIsFolded] = useState(!isOpen);
  return (
    <div className={className || ""}>
      <ArrowSelector
        labelNS={labelNS}
        whenLabel={whenLabel}
        isFolded={isFolded}
        setIsFolded={setIsFolded}
        onOpen={onOpen}
        onClose={onClose}
      />
      {!isFolded && <div>{children}</div>}
    </div>
  );
}

// FoldableComponent.propTypes = {
//   classname: PropTypes.string,
//   labelNS: PropTypes.string,
//   isOpen: PropTypes.bool,
//   whenLabel: PropTypes.string,
//   children: PropTypes.,
// };

// FoldableComponent.defaultProps = {
//   watch: null,
// };
export default FoldableComponent;
