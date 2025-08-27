import tranlationInstance from "../../services/translationInstance";
import FormatForm from "../shared/FormatForm";

export default function OeuvresManagementCreateFormat() {
  const tPageText = tranlationInstance("pageText:OeuvresManagement.OMFormats");

  return (
    <div className="OeuvresManagementCreateFormat">
      <h1>{tPageText("createFormat")}</h1>
      <FormatForm />
    </div>
  );
}
