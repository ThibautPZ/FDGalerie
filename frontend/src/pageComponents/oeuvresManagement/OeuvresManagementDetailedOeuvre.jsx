import { useState } from "react";
import { Link } from "react-router-dom";

import "../../scss/Oeuvre.scss";

import ZoomedPainting from "../../components/ZoomedPainting";
import PaintingThumbLg from "../../components/image/PaintingThumbLg";
import FallbackImg from "../../components/image/FallbackImg";
import tranlationInstance from "../../services/translationInstance";
import { isStringNotEmpty } from "../../services/typesAndValidationChecks";

function OeuvresManagementDetailedOeuvre({ oeuvreData }) {
  const {
    id,
    title,
    width,
    height,
    techniques,
    support,
    format,
    family,
    artistCommentFr,
    artistCommentEnUS,
    artistCommentEnGB,
    oeuvreAvailability,
    availabilityName,
    fileName,
    fileExtension,
    sisters = [],
    gift = {},
    sale = {},
    reservation = {},
  } = oeuvreData;

  const [
    tPageText,
    tCommon,
    tCommonInfo,
    tTechniques,
    tSupports,
    tFormats,
    tFamilies,
  ] = tranlationInstance(
    "pageText:OeuvresManagement.OMDetailedOeuvre",
    "common",
    "common:info",
    "techniques",
    "supports",
    "paintingSizes",
    "families"
  );
  const [openZoomPainting, setOpenZoomPainting] = useState(false);

  const getTechniquesLength = () => {
    return techniques?.length;
  };

  const giveFullName = (firstName, lastName) => {
    if (!isStringNotEmpty(firstName) && !isStringNotEmpty(lastName)) {
      return "";
    }
    if (isStringNotEmpty(firstName) && isStringNotEmpty(lastName)) {
      return `${firstName} ${lastName}`;
    }
    if (isStringNotEmpty(firstName)) {
      return firstName;
    }
    if (isStringNotEmpty(lastName)) {
      return lastName;
    }
    return tCommonInfo("unnamed");
  };

  const givePaintingOwnershipData = () => {
    if (oeuvreAvailability === 4 || oeuvreAvailability === 5) {
      return { isOwned: false };
    }
    let transactionData = {};
    const paintingOwnershipData = {
      isOwned: true,
    };

    if (oeuvreAvailability === 1) {
      transactionData = gift;
      paintingOwnershipData.tParagraphNS = "oeuvreGivenInfo";
      paintingOwnershipData.tLinkNS = "clickToGoGiftedPersonProfile";
      paintingOwnershipData.transactionPrice = "";
    }
    if (oeuvreAvailability === 2) {
      transactionData = sale;
      paintingOwnershipData.tParagraphNS = "oeuvreSoldInfo";
      paintingOwnershipData.tLinkNS = "clickToGoSoldPersonProfile";
      paintingOwnershipData.transactionPrice = sale.price;
    }
    if (oeuvreAvailability === 3) {
      transactionData = reservation;
      paintingOwnershipData.tParagraphNS = "oeuvreReservedInfo";
      paintingOwnershipData.tLinkNS = "clickToGoReservedPersonProfile";
      paintingOwnershipData.transactionPrice = isStringNotEmpty(
        reservation.price
      )
        ? tPageText("oeuvreReservedPrice", { price: reservation.price })
        : "";
    }
    const { userId, contactId, firstName, lastName, date, transactionNumber } =
      transactionData;
    if (userId) {
      paintingOwnershipData.ownerStatus = "user";
      paintingOwnershipData.ownerId = userId;
      paintingOwnershipData.linkedURL = `/management/users/id:${userId}`;
    } else {
      paintingOwnershipData.ownerStatus = "contact";
      paintingOwnershipData.ownerId = contactId;
      paintingOwnershipData.linkedURL = `/management/contacts/id:${contactId}`;
    }
    paintingOwnershipData.ownerName = giveFullName(firstName, lastName);
    paintingOwnershipData.transactionDate = tCommon("intlDate", {
      val: new Date(date),
      formatParams: {
        val: {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      },
    });
    paintingOwnershipData.transactionNumber = transactionNumber;

    return paintingOwnershipData;
  };

  const {
    isOwned,
    tParagraphNS,
    tLinkNS,
    linkedURL,
    ownerStatus,
    ownerId,
    ownerName,
    transactionDate,
    transactionPrice,
    transactionNumber,
  } = givePaintingOwnershipData();

  const handlePaintingClick = () => {
    setOpenZoomPainting(true);
  };
  const handleCloseModal = () => {
    setOpenZoomPainting(false);
  };

  return (
    <div className="OeuvresManagementDetailedOeuvre">
      {fileName && fileExtension ? (
        <button type="button" onClick={handlePaintingClick}>
          <PaintingThumbLg fileName={fileName} />
        </button>
      ) : (
        <FallbackImg />
      )}
      <h2>{title}</h2>
      <p>{tPageText("oeuvreNumber", { number: id })}</p>
      <p>
        {tPageText("technique", { count: getTechniquesLength() })}
        {tPageText("techniquesList", {
          val: techniques?.map((technique) => tTechniques(`${technique}.name`)),
        })}
      </p>
      <p>
        {tPageText("support", {
          support: tSupports(`${support}.name`),
        })}
      </p>
      <p>
        {tPageText("format", {
          format: tFormats(`${format}.name`),
          width,
          height,
        })}
      </p>
      {sisters?.length > 0 && (
        <div>
          <p>
            {tPageText("family", {
              family: tFamilies(`${family}.name`),
            })}
          </p>
          <p>
            {sisters?.map(
              ({ id: sisterId, title: sisterTitle }, index, array) => (
                <Link to={`/management/oeuvres/id:${sisterId}`} key={sisterId}>
                  <span>
                    {sisterTitle}
                    {index !== array.length - 1 ? ", " : ""}
                  </span>
                </Link>
              )
            )}
            {tPageText("clickToGo")}
          </p>
        </div>
      )}
      {artistCommentFr ? (
        <div>
          <p>{tPageText("commentFr")}</p>
          <p>{artistCommentFr}</p>
        </div>
      ) : (
        ""
      )}
      {artistCommentEnUS ? (
        <div>
          <p>{tPageText("commentEnUS")}</p>
          <p>{artistCommentEnUS}</p>
        </div>
      ) : (
        ""
      )}
      {artistCommentEnGB ? (
        <div>
          <p>{tPageText("commentEnGB")}</p>
          <p>{artistCommentEnGB}</p>
        </div>
      ) : (
        ""
      )}
      <p>
        {tPageText("availability", {
          availability: tCommon(`oeuvreAvailability.${availabilityName}`),
        })}
      </p>
      {isOwned ? (
        <>
          <p>
            {tPageText(tParagraphNS, {
              person: ownerName,
              status: tCommonInfo(ownerStatus),
              id: ownerId,
              price: transactionPrice,
              date: transactionDate,
              number: transactionNumber,
            })}
          </p>
          <Link to={linkedURL}>
            <span>{tPageText(tLinkNS)}</span>
          </Link>
        </>
      ) : (
        ""
      )}

      <ZoomedPainting
        isOpen={openZoomPainting}
        onClose={handleCloseModal}
        title={title}
        pathname={`${fileName}.${fileExtension}`}
      />
    </div>
  );
}

export default OeuvresManagementDetailedOeuvre;
