import tranlationInstance from "../../services/translationInstance";
import DateWithElapsedTime from "../../components/customComponents/DateWithElapsedTime";
import GivenPaintingsTable from "./GivenPaintingsTable";
import SoldPaintingsTable from "./SoldPaintingsTable";
import ReservedPaintingsTable from "./ReservedPaintingsTable";

export default function ContactManagementDetails({ contactData }) {
  const { contactInfo, giftedPaintings, soldPaintings, reservedPaintings } =
    contactData;
  const {
    contactId,
    firstname,
    lastname,
    address,
    postalCode,
    city,
    phoneNumber1,
    phoneNumber2,
    email,
    language,
    creationDate,
  } = contactInfo;

  const [tCommonInfo, tPageText] = tranlationInstance(
    "common:info",
    "pageText:ContactManagement.CMContactInfo",
    "common"
  );

  return (
    <div>
      <p>
        {tPageText("header", {
          firstname,
          lastname,
        })}
      </p>
      <div>
        <span>{tCommonInfo("lastname")}</span>
        <span>{lastname || tCommonInfo("unregistered")}</span>
      </div>
      <div>
        <span>{tCommonInfo("firstname")}</span>
        <span>{firstname || tCommonInfo("unregistered")}</span>
      </div>
      <div>
        <span>{tCommonInfo("address")}</span>
        <span>{address || tCommonInfo("unregistered")}</span>
      </div>
      <div>
        <span>{tCommonInfo("postalCode")}</span>
        <span>{postalCode || tCommonInfo("unregistered")}</span>
      </div>
      <div>
        <span>{tCommonInfo("city")}</span>
        <span>{city || tCommonInfo("unregistered")}</span>
      </div>
      <div>
        <span>{tCommonInfo("email")}</span>
        <span>{email || tCommonInfo("unregistered")}</span>
      </div>
      <div>
        <span>{tCommonInfo("phoneNumber", { number: 1 })}</span>
        <span>{phoneNumber1 || tCommonInfo("unregistered")}</span>
      </div>
      <div>
        <span>{tCommonInfo("phoneNumber", { number: 2 })}</span>
        <span>{phoneNumber2 || tCommonInfo("unregistered")}</span>
      </div>
      <div>
        <span>{tCommonInfo("spokenLanguage")}</span>
        <span>{language || tCommonInfo("unregistered")}</span>
      </div>
      <div>
        <span>{tCommonInfo("creationDate")}</span>
        <DateWithElapsedTime date={creationDate} />
      </div>
      <div>
        <span>{tCommonInfo("contactId")}</span>
        <span>{contactId}</span>
      </div>
      <div>
        <GivenPaintingsTable paintingsList={giftedPaintings} />
      </div>
      <div>
        <SoldPaintingsTable paintingsList={soldPaintings} />
      </div>
      <div>
        <ReservedPaintingsTable paintingsList={reservedPaintings} />
      </div>
    </div>
  );
}
