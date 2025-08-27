import { useOutletContext } from "react-router-dom";

import "../../scss/Oeuvre.scss";

import OeuvresManagementCreateOeuvreForm from "./OeuvresManagementCreateOeuvreForm";
import FoldableComponent from "../../components/FoldableComponent";
import CreateContactForm from "../../components/CreateContactForm";
import translationInstance from "../../services/translationInstance";
import FamilyForm from "../shared/FamilyForm";
import FormatForm from "../shared/FormatForm";
import SupportForm from "../shared/SupportForm";
import TechniqueForm from "../shared/TechniqueForm";

function OeuvresManagementCreateOeuvre() {
  const tPageText = translationInstance(
    "pageText:OeuvresManagement.OMCreateOeuvre"
  );

  const { createOeuvreMutation, createOeuvreFormMethods } = useOutletContext();

  const popUpNS = "popUpContent:";
  const onFoldClose = {
    condition: createOeuvreFormMethods.formState.isDirty,
    popUpNS,
  };

  return (
    <div className="OeuvresManagementCreateOeuvre">
      <div>
        <OeuvresManagementCreateOeuvreForm
          mutation={createOeuvreMutation}
          formMethods={createOeuvreFormMethods}
        />
        <FoldableComponent
          className=""
          labelText={tPageText("createNewContact")}
          isOpen={false}
          whenLabel="always"
          onOpen={null}
          onClose={onFoldClose}
        >
          <CreateContactForm />
        </FoldableComponent>
        <FoldableComponent
          className=""
          labelText={tPageText("createNewTechnique")}
          isOpen={false}
          whenLabel="always"
          onOpen={null}
          onClose={onFoldClose}
        >
          <TechniqueForm />
        </FoldableComponent>
        <FoldableComponent
          className=""
          labelText={tPageText("createNewFamily")}
          isOpen={false}
          whenLabel="always"
          onOpen={null}
          onClose={onFoldClose}
        >
          <FamilyForm />
        </FoldableComponent>

        <FoldableComponent
          className=""
          labelText={tPageText("createNewFormat")}
          isOpen={false}
          whenLabel="always"
          onOpen={null}
          onClose={onFoldClose}
        >
          <FormatForm />
        </FoldableComponent>
        <FoldableComponent
          className=""
          labelText={tPageText("createNewSupport")}
          isOpen={false}
          whenLabel="always"
          onOpen={null}
          onClose={onFoldClose}
        >
          <SupportForm />
        </FoldableComponent>
      </div>
    </div>
  );
}
export default OeuvresManagementCreateOeuvre;
