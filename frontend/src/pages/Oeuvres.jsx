import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import OeuvresList from "../pageComponents/oeuvres/OeuvresList";

import "../scss/Oeuvres.scss";

function Oeuvres() {
  const [oeuvresList, setOeuvresList] = useState([]);

  const fetchAllOeuvres = async () => {
    try {
      const paintingsList = await axiosInstance.get(`/api/paintings/`);

      setOeuvresList(paintingsList.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOeuvres();
  }, []);

  return (
    <div className="Oeuvres">
      <h1>Toutes mes oeuvres</h1>

      <OeuvresList oeuvresList={oeuvresList} />
    </div>
  );
}

export default Oeuvres;
