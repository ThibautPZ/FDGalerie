import { useOutletContext } from "react-router-dom";

import "../../scss/Oeuvre.scss";

import OeuvresManagementCreateOeuvreForm from "./OeuvresManagementCreateOeuvreForm";
import FoldableComponent from "../../components/FoldableComponent";
import CreateContactForm from "../../components/CreateContactForm";
import translationInstance from "../../services/translationInstance";
import CreateTechniqueForm from "../shared/CreateTechniqueForm";
import CreateFamilyForm from "../shared/CreateFamilyForm";

function OeuvresManagementCreateOeuvre() {
  const tPageText = translationInstance(
    "pageText:OeuvresManagement.OMCreateOeuvre"
  );

  const { createOeuvreMutation, createContactFormMethods } = useOutletContext();

  const popUpNS = "popUpContent:";
  const onFoldClose = {
    condition: createContactFormMethods.formState.isDirty,
    popUpNS,
  };

  return (
    <div className="OeuvresManagementCreateOeuvre">
      <div>
        <OeuvresManagementCreateOeuvreForm mutation={createOeuvreMutation} />
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
          <CreateTechniqueForm />
        </FoldableComponent>
        <FoldableComponent
          className=""
          labelText={tPageText("createNewFamily")}
          isOpen={false}
          whenLabel="always"
          onOpen={null}
          onClose={onFoldClose}
        >
          <CreateFamilyForm />
        </FoldableComponent>
      </div>
    </div>
  );
}
export default OeuvresManagementCreateOeuvre;
