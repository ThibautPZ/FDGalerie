import { useOutletContext } from "react-router-dom";
import tranlationInstance from "../../services/translationInstance";
import FoldableComponent from "../../components/FoldableComponent";
import OeuvresManagementOeuvresList from "./OeuvresManagementOeuvresList";

export default function OeuvresManagementDetailedAttribute({
  attributeData,
  tAttributePageText,
  tAttribute,
  setIsModifying,
}) {
  const {
    relatedOeuvres,
    name,
    nameFr,
    nameEnUS,
    nameEnGB,
    descriptionFr,
    descriptionEnUS,
    descriptionEnGB,
    nbPaintings,
    id,
  } = attributeData;

  const {
    techniquesQuery,
    familiesQuery,
    formatsQuery,
    supportsQuery,
    isFolded,
    setIsFolded,
  } = useOutletContext();

  const tPageText = tranlationInstance(
    "pageText:OeuvresManagement.OMDetailedAttribute"
  );

  return (
    <div>
      <h1>
        {tAttributePageText("title")}
        {tAttribute(`${name}.name`)}
      </h1>
      <div>
        <p>{tAttributePageText("id", { id })}</p>
      </div>
      <div>
        <p>{tPageText("nameFr")}</p>
        <p>{nameFr}</p>
      </div>
      <div>
        <p>{tPageText("nameEnUS")}</p>
        <p>{nameEnUS}</p>
      </div>
      <div>
        <p>{tPageText("nameEnGB")}</p>
        <p>{nameEnGB}</p>
      </div>
      <div>
        <p>{tPageText("descriptionFr")}</p>
        <p>{descriptionFr}</p>
      </div>
      <div>
        <p>{tPageText("descriptionEnUS")}</p>
        <p>{descriptionEnUS}</p>
      </div>
      <div>
        <p>{tPageText("descriptionEnGB")}</p>
        <p>{descriptionEnGB}</p>
      </div>
      <div>
        <p>{tAttributePageText("nbRelatedOeuvres")}</p>
        <p>{nbPaintings || tAttributePageText("noRelatedOeuvres")}</p>
      </div>
      <button type="button" onClick={() => setIsModifying(true)}>
        {tAttributePageText("modifyBtn")}
      </button>
      {nbPaintings ? (
        <FoldableComponent
          isOpen={!isFolded}
          foldedState={isFolded}
          foldedSetState={setIsFolded}
          whenLabel="always"
          labelText={tAttributePageText("relatedOeuvres")}
        >
          <OeuvresManagementOeuvresList
            oeuvresList={relatedOeuvres}
            techniques={techniquesQuery.data}
            families={familiesQuery.data}
            formats={formatsQuery.data}
            supports={supportsQuery.data}
            setIsModifying={setIsModifying}
          />
        </FoldableComponent>
      ) : null}
    </div>
  );
}
