import { useState } from "react";

import ArrowSelector from "./customComponents/ArrowSelector";

export default function FoldableComponent({
  className,
  labelText,
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
        labelText={labelText}
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
