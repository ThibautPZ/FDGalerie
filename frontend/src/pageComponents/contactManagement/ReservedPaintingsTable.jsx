import OwningPaintingsWrapper from "./OwningPaintingsWrapper";
import FoldableComponent from "../../components/FoldableComponent";
import OwningPaintingsTableBase from "./OwningPaintingsTableBase";
import tranlationInstance from "../../services/translationInstance";

export default function ReservedPaintingsTable({ paintingsList }) {
  const tPageText = tranlationInstance(
    "pageText:ContactManagement.CMContactInfo"
  );

  const defaultColumns = [
    ["pathname"],
    ["title", ["common:info.oeuvreTitle"], { sorting: true }],
    ["price", ["common:info.priceEur"], { sorting: true }],
    [
      "reservationDate",
      ["pageText:ContactManagement.ReservedPaintingsTable.reservationDate"],
      {
        sorting: true,
      },
    ],
    ["paintingId", ["common:info.paintingId"]],
    [
      "reservationNumber",
      ["pageText:ContactManagement.ReservedPaintingsTable.reservationNumber"],
      { sorting: true },
    ],
  ];

  return (
    <OwningPaintingsWrapper
      paintingsList={paintingsList}
      fallbackText={tPageText("noReservedPaintings")}
    >
      <FoldableComponent
        whenLabel="always"
        labelText={tPageText("reservedPaintings", {
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
