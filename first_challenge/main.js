const drawHourglass = async (lines) => {
  let hourglass = [];
  hourglass.push(drawFullLine(lines));
  for (let i = 0; i < lines - 2; i++) {
    hourglass.push(drawLine(lines, i));
  }
  hourglass.push(drawFullLine(lines));

  let auxInterval = 1;

  const interval = setInterval(() => {
    if (auxInterval < lines / 2) {
      let aux = hourglass[auxInterval];
      hourglass[auxInterval] = hourglass[lines - auxInterval - 1];
      hourglass[lines - auxInterval - 1] = aux;
      console.log(printArr(hourglass) + "\n");
      auxInterval++;
    } else {
      clearInterval(interval);
    }
  }, 1000);

  console.log(`${printArr(hourglass)} \nn= ${lines}`);
};

const drawFullLine = (size) => {
  let line = "";
  for (let i = 0; i < size; i++) {
    line += "#";
  }
  return line;
};

const drawLine = (size, lineNumber) => {
  let line = "";
  let blankSpaces = lineNumber * 2;
  let hashes = size - blankSpaces - 2;

  line += "#";
  for (let i = 0; i < size - 2; i++) {
    if (hashes > 0) {
      if (i < blankSpaces / 2 || i >= blankSpaces / 2 + hashes) {
        line += " ";
      } else {
        line += "#";
      }
    } else {
      let newHashes = Math.abs(hashes);

      let newBlankSpaces = size - newHashes;
      if (i === newBlankSpaces / 2 - 2) {
        line += "#";
      } else if (i === newBlankSpaces / 2 - hashes - 1) {
        line += "#";
      } else {
        line += " ";
      }
    }
  }
  line += "#";
  return line;
};

const printArr = (arr) => {
  return arr
    .toString()
    .replaceAll(",", "\n")
    .replace("[", "")
    .replace("]", "")
    .trim();
};

drawHourglass(20);
