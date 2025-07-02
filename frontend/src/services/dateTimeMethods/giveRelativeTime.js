const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const bissextilYears = [
  1584, 1588, 1592, 1596, 1600, 1604, 1608, 1612, 1616, 1620, 1624, 1628, 1632,
  1636, 1640, 1644, 1648, 1652, 1656, 1660, 1664, 1668, 1672, 1676, 1680, 1684,
  1688, 1692, 1696, 1704, 1708, 1712, 1716, 1720, 1724, 1728, 1732, 1736, 1740,
  1744, 1748, 1752, 1756, 1760, 1764, 1768, 1772, 1776, 1780, 1784, 1788, 1792,
  1796, 1804, 1808, 1812, 1816, 1820, 1824, 1828, 1832, 1836, 1840, 1844, 1848,
  1852, 1856, 1860, 1864, 1868, 1872, 1876, 1880, 1884, 1888, 1892, 1896, 1904,
  1908, 1912, 1916, 1920, 1924, 1928, 1932, 1936, 1940, 1944, 1948, 1952, 1956,
  1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008,
  2012, 2016, 2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060,
  2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096, 2104, 2108, 2112, 2116,
  2120, 2124, 2128, 2132, 2136, 2140, 2144, 2148, 2152, 2156, 2160, 2164, 2168,
  2172, 2176, 2180, 2184, 2188, 2192, 2196, 2204, 2208, 2212, 2216, 2220, 2224,
  2228, 2232, 2236, 2240, 2244, 2248, 2252, 2256, 2260, 2264, 2268, 2272, 2276,
  2280, 2284, 2288, 2292, 2296, 2304, 2308, 2312, 2316, 2320, 2324, 2328, 2332,
  2336, 2340, 2344, 2348, 2352, 2356, 2360, 2364, 2368, 2372, 2376, 2380, 2384,
  2388, 2392, 2396, 2400, 2404, 2408, 2412, 2416, 2420, 2424, 2428, 2432, 2436,
  2440, 2444, 2448, 2452, 2456, 2460, 2464, 2468, 2472, 2476, 2480, 2484, 2488,
  2492, 2496, 2504, 2508, 2512, 2516, 2520, 2524, 2528, 2532, 2536, 2540, 2544,
  2548, 2552, 2556, 2560, 2564, 2568, 2572, 2576, 2580, 2584, 2588, 2592, 2596,
  2604, 2608, 2612, 2616, 2620, 2624, 2628, 2632, 2636, 2640, 2644, 2648, 2652,
  2656, 2660, 2664, 2668, 2672, 2676, 2680, 2684, 2688, 2692, 2696, 2704, 2708,
  2712, 2716, 2720, 2724, 2728, 2732, 2736, 2740, 2744, 2748, 2752, 2756, 2760,
  2764, 2768, 2772, 2776, 2780, 2784, 2788, 2792, 2796, 2800, 2804, 2808, 2812,
  2816, 2820, 2824, 2828, 2832, 2836, 2840, 2844, 2848, 2852, 2856, 2860, 2864,
  2868, 2872, 2876, 2880, 2884, 2888, 2892, 2896, 2904, 2908, 2912, 2916, 2920,
  2924, 2928, 2932, 2936, 2940, 2944, 2948, 2952, 2956, 2960, 2964, 2968, 2972,
  2976, 2980, 2984, 2988, 2992, 2996,
];

export default function giveRelativeTime(comparedDate, referenceDate) {
  const comparedTimeMs = new Date(comparedDate);
  const referenceTimeMS = referenceDate ? new Date(referenceDate) : new Date();

  const difference = comparedTimeMs - referenceTimeMS;

  if (difference === 0) {
    return [0, 0, 0, 0, 0, 0, 0];
  }

  const isDifferencePositive = difference > 0;

  let isBorrowing = false;

  const giveTimeUnits = (dateObj) => {
    const milliSeconds = dateObj.getMilliseconds();
    const seconds = dateObj.getSeconds();
    const minutes = dateObj.getMinutes();
    const hours = dateObj.getHours();
    const days = dateObj.getDate();
    const months = dateObj.getMonth();
    const years = dateObj.getFullYear();
    return { years, months, days, hours, minutes, seconds, milliSeconds };
  };

  const minuend = isDifferencePositive
    ? giveTimeUnits(comparedTimeMs)
    : giveTimeUnits(referenceTimeMS);
  const substrahend = isDifferencePositive
    ? giveTimeUnits(referenceTimeMS)
    : giveTimeUnits(comparedTimeMs);

  const isYearBissextile = (year) => {
    return bissextilYears.some((el) => el === year);
  };

  const giveNumberOfDays = (year, month) => {
    let numberOfDays = daysInMonth[month];

    if (month === 1 && isYearBissextile(year)) {
      numberOfDays = 29;
    }
    if (month < 1) {
      numberOfDays = daysInMonth[11];
    }
    if (month > 11) {
      [numberOfDays] = daysInMonth;
    }
    return numberOfDays;
  };

  const giveSubstrahendWithBorrowingYMD = (
    substraYear,
    substraMonth,
    substraDay,
    valueToUpdate
  ) => {
    let updatedYear = substraYear;
    let updatedMonth = substraMonth;
    let updatedDay = substraDay;
    if (valueToUpdate === "days") {
      if (substraDay === giveNumberOfDays(substraYear, substraMonth)) {
        updatedMonth += 1;
        updatedDay = 1;
      } else {
        updatedDay += 1;
      }
    }
    if (valueToUpdate === "months") {
      updatedMonth += 1;
    }
    if (updatedMonth > 11) {
      updatedMonth = 0;
      updatedYear += 1;
    }
    return { years: updatedYear, months: updatedMonth, days: updatedDay };
  };

  const substract = (minuendUnit, substrahendUnit, unitDizaine) => {
    let substrahendWithBorrowing = substrahendUnit;
    if (isBorrowing) {
      substrahendWithBorrowing += 1;
      isBorrowing = false;
    }

    if (minuendUnit > substrahendWithBorrowing) {
      return minuendUnit - substrahendWithBorrowing;
    }
    if (minuendUnit < substrahendWithBorrowing) {
      isBorrowing = true;
      return minuendUnit + unitDizaine - substrahendWithBorrowing;
    }
    return 0;
  };

  const giveDifference = (subMinuend, subSubstrahend, dizaine) => {
    const subResult = substract(subMinuend, subSubstrahend, dizaine);
    if (!isDifferencePositive) {
      return -subResult;
    }
    return subResult;
  };

  const subtractDMY = (minuendDMY, substrahendDMY) => {
    let dDiff = 0;
    let mtDiff = 0;
    let yDiff = 0;
    let updatedSubtraDMY = {
      years: substrahendDMY.years,
      months: substrahendDMY.months,
      days: substrahendDMY.days,
    };

    if (isBorrowing) {
      updatedSubtraDMY = {
        ...giveSubstrahendWithBorrowingYMD(
          updatedSubtraDMY.years,
          updatedSubtraDMY.months,
          updatedSubtraDMY.days,
          "days"
        ),
      };
      isBorrowing = false;
    }

    if (minuendDMY.days > updatedSubtraDMY.days) {
      dDiff = minuendDMY.days - updatedSubtraDMY.days;
    }

    if (minuendDMY.days < updatedSubtraDMY.days) {
      isBorrowing = true;
      const daysInMinuendMonth = giveNumberOfDays(
        updatedSubtraDMY.years,
        updatedSubtraDMY.months
      );
      dDiff = minuendDMY.days + daysInMinuendMonth - updatedSubtraDMY.days;
    }

    if (isBorrowing) {
      updatedSubtraDMY = {
        ...giveSubstrahendWithBorrowingYMD(
          updatedSubtraDMY.years,
          updatedSubtraDMY.months,
          updatedSubtraDMY.days,
          "months"
        ),
      };
      isBorrowing = false;
    }
    if (minuendDMY.months > updatedSubtraDMY.months) {
      mtDiff = minuendDMY.months - updatedSubtraDMY.months;
    }
    if (minuendDMY.months < updatedSubtraDMY.months) {
      isBorrowing = true;
      mtDiff = minuendDMY.months + 12 - updatedSubtraDMY.months;
    }

    if (isBorrowing) {
      yDiff = minuendDMY.years - updatedSubtraDMY.years - 1;
      isBorrowing = false;
    } else {
      yDiff = minuendDMY.years - updatedSubtraDMY.years;
    }
    if (!isDifferencePositive) {
      dDiff = -dDiff;
      mtDiff = -mtDiff;
      yDiff = -yDiff;
    }
    return { dDiff, mtDiff, yDiff };
  };

  const substractAllUnits = (minuendObj, substrahendObj) => {
    const msDiff = giveDifference(
      minuendObj.milliSeconds,
      substrahendObj.milliSeconds,
      1000
    );
    const sDiff = giveDifference(
      minuendObj.seconds,
      substrahendObj.seconds,
      60
    );
    const mnDiff = giveDifference(
      minuendObj.minutes,
      substrahendObj.minutes,
      60
    );
    const hrDiff = giveDifference(minuendObj.hours, substrahendObj.hours, 24);

    const { dDiff, mtDiff, yDiff } = subtractDMY(minuendObj, substrahendObj);

    return [yDiff, mtDiff, dDiff, hrDiff, mnDiff, sDiff, msDiff];
  };

  const returnedValues = substractAllUnits(minuend, substrahend);

  return returnedValues;
}
