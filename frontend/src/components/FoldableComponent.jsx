import { useState } from "react";

import ArrowSelector from "./customComponents/ArrowSelector";

import { isBoolean, isFunction } from "../services/typesAndValidationChecks";

export default function FoldableComponent({
  className,
  labelText,
  isOpen,
  foldedState,
  foldedSetState,
  whenLabel,
  onOpen,
  onClose,
  children,
}) {
  const isFoldedStateSupplied =
    isBoolean(foldedState) && isFunction(foldedSetState);

  const [isFolded, setIsFolded] = isFoldedStateSupplied
    ? [foldedState, foldedSetState]
    : useState(!isOpen);
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
