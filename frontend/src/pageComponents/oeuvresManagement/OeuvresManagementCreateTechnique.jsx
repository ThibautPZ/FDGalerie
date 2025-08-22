import tranlationInstance from "../../services/translationInstance";
import TechniqueForm from "../shared/TechniqueForm";

export default function OeuvresManagementCreateTechnique() {
  const tPageText = tranlationInstance(
    "pageText:OeuvresManagement.OMTechniques"
  );
  return (
    <div>
      <h1>{tPageText("createTechnique")}</h1>
      <TechniqueForm />
    </div>
  );
}
