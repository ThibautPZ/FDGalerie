import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import OeuvresList from "../pageComponents/oeuvres/OeuvresList";

import "../scss/Categorie.scss";

function Format() {
  const { nomFormat } = useParams();

  const [oeuvresList, setOeuvresList] = useState([]);

  const fetchOeuvresByFormat = async () => {
    try {
      const paintingsList = await axiosInstance.get(
        `/api/paintings/publicFormat/${nomFormat}`
      );

      setOeuvresList(paintingsList.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOeuvresByFormat();
  }, [nomFormat]);

  return (
    <div className="Categorie">
      <h1>Format {nomFormat}</h1>

      <OeuvresList oeuvresList={oeuvresList} />
    </div>
  );
}

export default Format;
