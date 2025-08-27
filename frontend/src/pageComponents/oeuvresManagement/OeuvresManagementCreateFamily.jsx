import tranlationInstance from "../../services/translationInstance";
import FamilyForm from "../shared/FamilyForm";

export default function OeuvresManagementCreateFamily() {
  const tPageText = tranlationInstance("pageText:OeuvresManagement.OMFamilies");

  return (
    <div className="OeuvresManagementCreateFamily">
      <h1>{tPageText("createFamily")}</h1>
      <FamilyForm />
    </div>
  );
}
