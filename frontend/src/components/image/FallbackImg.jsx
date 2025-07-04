import tranlationInstance from "../../services/translationInstance";
import NoImageEn from "../SVG/NoImageEn";
import NoImageFr from "../SVG/NoImageFr";

export default function FallbackImg() {
  const i18n = tranlationInstance("i18n");
  if (i18n.resolvedLanguage === "fr") {
    return <NoImageFr />;
  }
  return <NoImageEn />;
}
