/**
 * Renders a option input in a SelectInput component.
 * @component
 * @param {Object} props - Component props
 * @param {(string|number)} props.fieldName - Field name in RHF
 * @param {(string|number)} props.translationIndex - Option input text content index for translation function
 * @param {(string|number)} props.displayedLabel - Option input text content
 * @param {(string|number)} props.optionValue - Radio input value
 * @param {*} [props.defaultValue] - Input default value
 * @param {boolean} props.isDefault - In case of not defined default value, indicate if this input should be the default selected one
 * @param {function} props.t - Function i18n which returns a string in specified language
 * @returns {JSX.Element} Rendered radio container with a label with each radio input.
 */
function TextWithHighlights({
  // parentName,
  fullText,
  textToBeHighlighted,
}) {
  const giveTextClassname = (subString, isHighlighted) => {
    if (isHighlighted) {
      // return { text: subString, className: `${parentName}Text_highlight` };
      return { text: subString, className: `text_highlight` };
    }
    // return { text: subString, className: `${parentName}Text` };
    return { text: subString, className: `` };
  };

  const giveTextContent = () => {
    const displayedText = [];
    if (!textToBeHighlighted) {
      displayedText.push(giveTextClassname(fullText, false));
      return displayedText;
    }
    // const startsWithHighlight = fullText.startsWith(textToBeHighlighted);
    // const endsWithHighlight = fullText.endsWith(textToBeHighlighted);
    const substrArr = fullText.trim().split(textToBeHighlighted);

    for (let i = 0; i < substrArr.length; i += 1) {
      if (i === 0) {
        displayedText.push(giveTextClassname(substrArr[i], false));
      }
      if (i > 0) {
        displayedText.push(giveTextClassname(textToBeHighlighted, true));
        displayedText.push(giveTextClassname(substrArr[i], false));
      }
    }
    // if (startsWithHighlight) {
    //   displayedText.unshift(giveTextClassname(textToBeHighlighted, true));
    // }
    // if (endsWithHighlight) {
    //   displayedText.push(giveTextClassname(textToBeHighlighted, true));
    // }
    // console.log(displayedTextArr);

    return displayedText;
  };

  const textContent = giveTextContent();

  return (
    <span>
      {textContent?.length
        ? textContent.map((textObj) => (
            <span className={textObj.className}>{textObj.text}</span>
          ))
        : ""}{" "}
    </span>
  );
}

export default TextWithHighlights;
