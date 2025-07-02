function getTimeFromMilliseconds(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds - hours * 360000) / 60000);
  const seconds = Math.floor(
    (milliseconds - (hours * 360000 + minutes * 60000)) / 1000
  );

  return `${hours ? `${hours} h ` : ""}  ${
    hours || minutes ? `${minutes}  m ` : ""
  } ${seconds ? `${seconds} s ` : ""}`;
}

export default getTimeFromMilliseconds;
