import { useOutletContext } from "react-router-dom";

import "../../scss/Oeuvre.scss";

import OeuvresManagementCreateOeuvreForm from "./OeuvresManagementCreateOeuvreForm";
import FoldableComponent from "../../components/FoldableComponent";
import CreateContactForm from "../../components/CreateContactForm";
import translationInstance from "../../services/translationInstance";

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
      </div>
    </div>
  );
}
export default OeuvresManagementCreateOeuvre;
