import tranlationInstance from "../../services/translationInstance";
import OwningPaintingsWrapper from "./OwningPaintingsWrapper";
import FoldableComponent from "../../components/FoldableComponent";
import OwningPaintingsTableBase from "./OwningPaintingsTableBase";

export default function SoldPaintingsTable({ paintingsList }) {
  const tPageText = tranlationInstance(
    "pageText:ContactManagement.CMContactInfo"
  );
  const defaultColumns = [
    ["pathname"],
    ["title", ["common:info.oeuvreTitle"], { sorting: true }],
    ["price", ["common:info.priceEur"], { sorting: true }],
    [
      "saleDate",
      ["pageText:ContactManagement.SoldPaintingsTable.saleDate"],
      {
        sorting: true,
      },
    ],
    ["paintingId", ["common:info.paintingId"]],
    [
      "saleNumber",
      ["pageText:ContactManagement.SoldPaintingsTable.saleNumber"],
      { sorting: true },
    ],
  ];

  return (
    <OwningPaintingsWrapper
      paintingsList={paintingsList}
      fallbackText={tPageText("noSoldPaintings")}
    >
      <FoldableComponent
        whenLabel="always"
        labelText={tPageText("soldPaintings", {
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
