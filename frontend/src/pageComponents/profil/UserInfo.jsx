import { useCurrentUserContext } from "../../contexts/CurrentUserContext";

function UserInfo({ setFormState }) {
  const { user } = useCurrentUserContext();
  const unregistered = "Non renseigné";
  return (
    <div>
      <p>Vos informations</p>
      <div>
        <div>
          <p>Prénom :</p>
          <p>{user.firstname || unregistered}</p>
        </div>
        <div>
          <p>Nom de famille :</p>
          <p>{user.lastname || unregistered}</p>
        </div>
        <div>
          <p>Email :</p>
          <p>{user.email}</p>
        </div>
        <div>
          <p>Téléphone :</p>
          <p>{user.phoneNumber1 || unregistered}</p>
        </div>
        <div>
          <p>Téléphone 2 :</p>
          <p>{user.phoneNumber2 || unregistered}</p>
        </div>
        <div>
          <p>Adresse :</p>
          <p>{user.address || unregistered}</p>
        </div>
        <div>
          <p>Code postal :</p>
          <p>{user.postalCode || unregistered}</p>
        </div>
        <div>
          <p>Ville :</p>
          <p>{user.city || unregistered}</p>
        </div>
      </div>
      <button type="button" onClick={() => setFormState("modification")}>
        Modifier mes informations
      </button>
      <button type="button" onClick={() => setFormState("passwordUpdate")}>
        Changer mon mot de passe
      </button>
    </div>
  );
}

export default UserInfo;
