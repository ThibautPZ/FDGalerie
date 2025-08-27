import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import OeuvresList from "../pageComponents/oeuvres/OeuvresList";

import "../scss/Categorie.scss";

function Technique() {
  const { nomTechnique } = useParams();

  const [oeuvresList, setOeuvresList] = useState([]);

  const fetchOeuvresByTechnique = async () => {
    try {
      const paintingsList = await axiosInstance.get(
        `/api/paintings/publicTechnique/${nomTechnique}`
      );

      setOeuvresList(paintingsList.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOeuvresByTechnique();
  }, [nomTechnique]);

  return (
    <div className="Categorie">
      <h1> {nomTechnique}</h1>

      <OeuvresList oeuvresList={oeuvresList} />
    </div>
  );
}

export default Technique;
