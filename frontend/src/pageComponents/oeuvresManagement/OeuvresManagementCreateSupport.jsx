import tranlationInstance from "../../services/translationInstance";
import SupportForm from "../shared/SupportForm";

export default function OeuvresManagementCreateSupport() {
  const tPageText = tranlationInstance("pageText:OeuvresManagement.OMSupports");

  return (
    <div className="OeuvresManagementCreateSupport">
      <h1>{tPageText("createSupport")}</h1>
      <SupportForm />
    </div>
  );
}
