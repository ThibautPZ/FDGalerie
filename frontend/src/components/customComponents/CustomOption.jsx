import { components } from "react-select";
import TextWithHighlights from "./TextWithHighlights";
import AdditionalSelectLabelInfo from "./AdditionalSelectLabelInfo";

function CustomOption(props) {
  const { value, label } = props;

  const newProps = { ...props, label: {} };

  return (
    <components.Option {...newProps}>
      {label.labelKeys.map((key) => (
        <TextWithHighlights
          parentName=""
          fullText={value[key]}
          textToBeHighlighted={label.searchedKeys[key]}
        />
      ))}
      <AdditionalSelectLabelInfo label={label} value={value} />
    </components.Option>
  );
}

export default CustomOption;
