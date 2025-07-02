import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useNavbarClassnameContext } from "../contexts/NavbarClassnameContext";
import useInterval from "../hooks/useInterval";
import useTimeout from "../hooks/useTimeout";

import "../scss/Diaporama.scss";
import getTimeFromMilliseconds from "../services/getTimeFromMilliseconds";

function Diaporama() {
  const [oeuvresList, setOeuvresList] = useState([]);
  const [currentOeuvre, setCurrentOeuvre] = useState({});
  const [fadeInOutClassname, setFadeInOutClassname] = useState("FadeInDiapo");
  const [buttonsShownClassname, setButtonsShownClassname] =
    useState("DiapoButtonsHidden");
  const [timeOutWillBeStarted, setTimeOutWillBeStarted] = useState(false);

  const [diapoDuration, setDiapoDuration] = useState(15000);
  const [diapoPlaying, setDiapoPlaying] = useState(false);
  const [timeBeforeNextPainting, setTimeBeforeNextPainting] = useState(null);
  const [timeBeforeElementsDisappear, setTimeBeforeElementsDisappear] =
    useState(null);
  const [playedDiaposIds, setPlayedDiaposIds] = useImmer([]);

  const { navbarClassname, setNavbarClassname } = useNavbarClassnameContext();

  const navigate = useNavigate();

  const getRandomIndexFromArray = (arr) => {
    return Math.round(Math.random() * (arr.length - 1));
  };

  const hasIndexBeenPlayed = (diapoIndex) => {
    return playedDiaposIds.some((id) => id === diapoIndex);
  };

  const managePlayedDiaposIds = (newId) => {
    setPlayedDiaposIds((prev) => {
      prev.push(newId);
    });
    if (
      oeuvresList.length &&
      playedDiaposIds.length > (oeuvresList.length * 6) / 10
    ) {
      setPlayedDiaposIds((prev) => {
        prev.shift();
      });
    }
  };

  const getRandomIndexNotAlreadyPlayedFromArray = (array) => {
    const indexToCheck = getRandomIndexFromArray(array);
    if (!hasIndexBeenPlayed(indexToCheck)) {
      managePlayedDiaposIds(indexToCheck);
      return indexToCheck;
    }
    // console.log("same: ", playedDiaposIds, indexToCheck);
    return getRandomIndexNotAlreadyPlayedFromArray(array);
  };

  const pickRandomPaintingToDisplay = (listArr) => {
    let currentOeuvreIndex = 0;
    if (currentOeuvre) {
      currentOeuvreIndex = currentOeuvre.id;
    }

    const index = getRandomIndexNotAlreadyPlayedFromArray(
      listArr,
      currentOeuvreIndex
    );

    return setCurrentOeuvre(listArr[index]);
  };

  const fetchAllOeuvres = async () => {
    try {
      const paintingsList = await axiosInstance.get(`/api/paintings/`);

      setOeuvresList(paintingsList.data);
      pickRandomPaintingToDisplay(paintingsList.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fadeOutCurrentThenDisplayNext = () => {
    setFadeInOutClassname("FadeOutDiapo");
    setTimeBeforeNextPainting(3100);
  };

  const stopDiaporama = () => {
    setDiapoPlaying(false);
  };

  const startDiaporama = () => {
    setDiapoPlaying(true);
  };

  const navigateToOeuvre = () => {
    setNavbarClassname("Navbar");
    navigate(`/oeuvre/${currentOeuvre.title}`);
  };

  const showNavbarAndButtons = () => {
    if (
      navbarClassname === "NavbarDiapoHidden" ||
      buttonsShownClassname === "DiapoButtonsHidden"
    ) {
      setNavbarClassname("NavbarDiapoShown");
      setButtonsShownClassname("DiapoButtonsShown");
    }
  };

  const modifyRangeInputStep = () => {
    if (diapoDuration < 30000) {
      return "1000";
    }
    if (diapoDuration < 60000) {
      return "2000";
    }
    if (diapoDuration < 120000) {
      return "5000";
    }
    return "10000";
  };

  useEffect(() => {
    fetchAllOeuvres();

    if (navbarClassname === "Navbar") {
      setNavbarClassname("NavbarDiapoHidden");
    }

    return () => {
      setNavbarClassname("Navbar");
    };
  }, []);

  useTimeout(() => {
    console.warn("time");
    if (navbarClassname !== "NavbarDiapoHidden") {
      setNavbarClassname("NavbarDiapoHidden");
    }
    if (buttonsShownClassname !== "DiapoButtonsHidden") {
      setButtonsShownClassname("DiapoButtonsHidden");
    }
    setTimeBeforeElementsDisappear(null);
  }, timeBeforeElementsDisappear);

  useInterval(() => {
    if (timeOutWillBeStarted) {
      if (timeBeforeElementsDisappear) {
        showNavbarAndButtons();
        setTimeBeforeElementsDisappear((prev) => prev * 0);
      }
      setTimeBeforeElementsDisappear((prev) => prev + 5000);

      setTimeOutWillBeStarted((prev) => !prev);
    }
  }, 200);

  useInterval(
    () => {
      console.warn("fade");
      fadeOutCurrentThenDisplayNext();
    },
    diapoPlaying ? diapoDuration : null
  );

  useTimeout(() => {
    console.warn("next");
    pickRandomPaintingToDisplay(oeuvresList);
    setFadeInOutClassname("FadeInDiapo");
    setTimeBeforeNextPainting(null);
  }, timeBeforeNextPainting);

  return currentOeuvre?.id ? (
    <div
      className="DiapoParent"
      onMouseMove={() => setTimeOutWillBeStarted(true)}
      onTouchStart={() => setTimeOutWillBeStarted(true)}
    >
      <div className={fadeInOutClassname}>
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${
            import.meta.env.VITE_PAINTINGS_PATH
          }/${currentOeuvre.pathname}`}
          alt={currentOeuvre.title}
        />
      </div>
      <div className={buttonsShownClassname} id="DiapoDuration">
        <p>{`Durée : ${getTimeFromMilliseconds(diapoDuration)}`}</p>
        <input
          type="range"
          min="10000"
          max="300000"
          step={modifyRangeInputStep()}
          value={diapoDuration}
          onChange={(e) => setDiapoDuration(e.target.value)}
        />
      </div>
      {diapoPlaying ? (
        <button
          className={buttonsShownClassname}
          id="DiapoStop"
          type="button"
          onClick={stopDiaporama}
        >
          Pause
        </button>
      ) : (
        <button
          className={buttonsShownClassname}
          id="DiapoStart"
          type="button"
          onClick={startDiaporama}
        >
          Démarrer le diaporama
        </button>
      )}

      <button
        className={buttonsShownClassname}
        id="DiapoLink"
        type="button"
        onClick={navigateToOeuvre}
      >
        Fiche de l'oeuvre
      </button>
    </div>
  ) : (
    ""
  );
}

export default Diaporama;
