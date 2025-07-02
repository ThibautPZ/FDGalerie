import { useState } from "react";

import "../../scss/CustomSelect.scss";

function CustomSelect({ defaultValue, name, ref, options }) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false);

  const handleMainButtonClick = () => {
    setOptionsPanelOpen(!optionsPanelOpen);
  };

  const givePanelClassname = () => {
    if (optionsPanelOpen) {
      return "panelOpen";
    }
    return "panelClose";
  };

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    return setOptionsPanelOpen(false);
  };

  return (
    <div className="customSelect">
      <input type="hidden" name={name} ref={ref} value={selectedValue} />
      <button type="button" onClick={() => handleMainButtonClick()}>
        <p>{selectedValue}</p>
        <img src="/src/assets/images/select_arrow.svg" alt="" />
      </button>
      <div className={givePanelClassname()}>
        {options?.map((option) => (
          <button
            type="button"
            className="selectOption"
            onClick={(e) => handleOptionClick(e.target.value)}
            value={option.value}
          >
            {option.content}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CustomSelect;
