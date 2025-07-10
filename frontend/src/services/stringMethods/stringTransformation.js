const trimStartingZeroes = (str) => {
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] !== "0") {
      if (i === 0) {
        return str;
      }
      return str.slice(i, str.length);
    }
  }
  return str;
};

export default trimStartingZeroes;
