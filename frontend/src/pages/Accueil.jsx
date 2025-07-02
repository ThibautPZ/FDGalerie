import { Link } from "react-router-dom";

import "../scss/Accueil.scss";

function Accueil() {
  return (
    <div className="Accueil">
      <p>Bienvenue dans ma galerie de peintures</p>
      <p>Venez découvrir mes travaux d'aquarelle, crayon, acrylique et encre</p>
      <Link to="/oeuvres">Commencer la visite</Link>
    </div>
  );
}

export default Accueil;
