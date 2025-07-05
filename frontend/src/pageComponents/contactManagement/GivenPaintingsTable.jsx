import FoldableComponent from "../../components/FoldableComponent";
import tranlationInstance from "../../services/translationInstance";
import OwningPaintingsTableBase from "./OwningPaintingsTableBase";
import OwningPaintingsWrapper from "./OwningPaintingsWrapper";

export default function GivenPaintingsTable({ paintingsList }) {
  const tPageText = tranlationInstance(
    "pageText:ContactManagement.CMContactInfo"
  );
  const defaultColumns = [
    ["pathname"],
    ["title", ["common:info.oeuvreTitle"], { sorting: true }],

    [
      "giftDate",
      ["pageText:ContactManagement.GivenPaintingsTable.giftDate"],
      {
        sorting: true,
      },
    ],
    ["paintingId", ["common:info.paintingId"]],
    [
      "giftNumber",
      ["pageText:ContactManagement.GivenPaintingsTable.giftNumber"],
      { sorting: true },
    ],
  ];

  return (
    <OwningPaintingsWrapper
      paintingsList={paintingsList}
      fallbackText={tPageText("noGivenPaintings")}
    >
      <FoldableComponent
        whenLabel="always"
        labelText={tPageText("givenPaintings", {
          count: paintingsList.length,
        })}
        isOpen
      >
        <OwningPaintingsTableBase
          paintingsList={paintingsList}
          columns={defaultColumns}
        />
      </FoldableComponent>
    </OwningPaintingsWrapper>
  );
}
