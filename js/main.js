var $ = jQuery;
let list = [];
let listofArr = [];

const objFieldsList = [
  "name",
  "alg",
  "chem",
  "pe",
  "lang",
  "bio",
  "science",
  "avg",
];

const onMouseOver = function () {
  var table1 = $(this).parent().parent().parent();
  var table2 = $(this).parent().parent();
  var verTable = $(table1).data("vertable") + "";
  var column = $(this).data("column") + "";

  $(table2)
    .find("." + column)
    .addClass("hov-column-" + verTable);
  $(table1)
    .find(".row100.head ." + column)
    .addClass("hov-column-head-" + verTable);
};

const onMouseOut = function () {
  var table1 = $(this).parent().parent().parent();
  var table2 = $(this).parent().parent();
  var verTable = $(table1).data("vertable") + "";
  var column = $(this).data("column") + "";

  $(table2)
    .find("." + column)
    .removeClass("hov-column-" + verTable);
  $(table1)
    .find(".row100.head ." + column)
    .removeClass("hov-column-head-" + verTable);
};

const setHandlers = function () {
  $(".column100").on("mouseover", onMouseOver);
  $(".column100").on("mouseout", onMouseOut);
};

const rankingsBody = document.querySelector("#student-rankings > tbody");

const createGenericCell = (cell, key) => {
  const td = document.createElement("td");
  td.textContent = cell;
  td.className = `column100 column${key}`;
  td.dataset.column = `column${key}`;

  return td;
};

const createDeleteRowCell = () => {
  const td = document.createElement("td");
  td.style.cursor = "pointer";
  //tdSpec.id = "delete-button";
  td.className = "column100 column9";
  td.dataset.column = "column9";
  td.style.paddingLeft = "10px";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "delete";
  deleteButton.style.height = "30px";

  td.append(deleteButton);

  return td;
};

const createRow = (rowData, rowId) => {
  const tr = document.createElement("tr");
  tr.className = "row100";
  tr.dataset.rowId = rowId;

  rowData.forEach((cell, key) => {
    const td = createGenericCell(cell, key);
    tr.appendChild(td);
  });

  const tdSpec = createDeleteRowCell();
  tr.appendChild(tdSpec);

  return tr;
};

function populateRankings(matrix) {
  matrix.forEach((row) => {
    const [rowId, ...rowData] = row;
    const tr = createRow(rowData, rowId);

    const $tr = $(tr);
    $(rankingsBody).append($tr).trigger("addRows", [$tr, true]);
  });
  checkData();
  setHandlers();
}

function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);
  reader.onload = function () {
    $(rankingsBody).empty();
    console.log(reader.result);
    let jsonParsed = JSON.parse(reader.result);

    listofArr = Object.keys(jsonParsed).map((studentId) => {
      const studentData = jsonParsed[studentId];
      const columns = objFieldsList.map((columnId) => studentData[columnId]);
      return [studentId, ...columns];
    });

    // for (let prop in jsonParsed) {
    //   list.push(jsonParsed[prop]);
    // }
    // listofArr = list.map(function (obj) {
    //   return objFieldsList.map(function (key) {
    //     return obj[key];
    //   });
    // });
    console.log(listofArr);
    populateRankings(listofArr);

    console.log(`list ${list}`);
  };
}

function checkData() {
  $("#nodata-container").remove();
  if (!Array.isArray(listofArr) || !listofArr.length) {
    let container = document.createElement("div");
    container.style.textAlign = "center";
    container.id = "nodata-container";
    let headerText = document.createElement("h4");
    let additionalText = document.createElement("p");
    additionalText.style.color = "#2a3f47";
    additionalText.textContent = "Upload a file or add a new student";
    headerText.textContent = "No data";
    headerText.style.fontSize = "35px";
    headerText.style.fontFamily = "Montserrat-Medium";
    const limiter = $(".container-table100");
    container.append(headerText);
    container.append(additionalText);
    limiter.append(container);
  }
}

document.addEventListener("DOMContentLoaded", checkData);

const getMarksArray = () => {
  return [
    +$("#bio").val(),
    +$("#alg").val(),
    +$("#sci").val(),
    +$("#lang").val(),
    +$("#chem").val(),
    +$("#pe").val(),
  ];
};

function submitForm(e) {
  e.preventDefault();
  $.modal.close();

  let newEntry = [];
  const marks = getMarksArray();
  const marksSum = marks.reduce(function (a, b) {
    return a + b;
  }, 0);
  const marksAvg = (marksSum / marks.length).toFixed(2);

  const name = $("#name").val();
  const surname = $("#surname").val();

  newEntry = [
    `student${listofArr.length}`,
    `${name} ${surname}`,
    ...marks,
    +marksAvg,
  ];
  listofArr.push(newEntry);

  console.log(newEntry);
  console.log(listofArr);

  const [rowId, ...rowData] = newEntry;
  const tr = createRow(rowData, rowId);

  rankingsBody.appendChild(tr);

  arrayToJSONObject(listofArr);
  checkData();
  setHandlers();
}

function arrayToJSONObject(matrix) {
  const finalObj = {};
  //header
  matrix.forEach((row) => {
    const [studentId, ...rowData] = row;
    const student = {};
    objFieldsList.forEach((field, j) => {
      student[field] = rowData[j];
    });

    finalObj[studentId] = student;
  });
  return finalObj;
}

function downloadClick() {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  let json = JSON.stringify(arrayToJSONObject(listofArr)),
    blob = new Blob([json], { type: "octet/stream" }),
    url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = "data.json";
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

$(function () {
  $("#add").click(() => {
    $("html, body").animate(
      { scrollTop: $(".buttons-container").offset().top },
      "slow"
    );
  });

  $(".submit-button").click(() => {
    $("html, body").animate(
      { scrollTop: $("#student-rankings").offset().top },
      "slow"
    );
  });

  $(".OpenModal").click(function (event) {
    $(this).modal({
      fadeDuration: 250,
      fadeDelay: 0.8,
    });
    return false;
  });

  $(rankingsBody).on("click", ".delete-button", function () {
    const $tr = $(this).closest("tr");
    const rowId = $tr.data("row-id");

    listofArr = listofArr.filter((row) => {
      const id = row[0];

      if (id !== rowId) return true;

      return false;
    });

    $tr.remove();
  });

  $("#contact").submit(submitForm);

  $("#student-rankings").tablesorter();

  setHandlers();
});
