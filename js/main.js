var $ = jQuery;
let list = [];
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

function populateRankings(json) {
  json.forEach((row) => {
    const tr = document.createElement("tr");
    tr.className = "row100";
    row.forEach((cell, key) => {
      const td = document.createElement("td");
      td.textContent = cell;
      td.className = `column100 column${key}`;
      td.dataset.column = `column${key}`;
      tr.appendChild(td);
    });
    const tdSpec = document.createElement("td");
    tdSpec.style.cursor = "pointer";
    //tdSpec.id = "delete-button";
    tdSpec.className = "column100 column9";
    tdSpec.dataset.column = "column9";
    tdSpec.style.paddingLeft = "10px";
    const deletebutton = document.createElement("button");
    deletebutton.className = "delete-button";
    deletebutton.textContent = "delete";
    deletebutton.style.height = "30px";
    tdSpec.append(deletebutton);
    tr.appendChild(tdSpec);
    const $tr = $(tr);
    $(rankingsBody).append($tr).trigger("addRows", [$tr, true]);
  });

  $("#student-rankings").on("click", ".delete-button", function () {
    $(this).closest("tr").remove();
  });

  setHandlers();
}

let listofArr = [];

function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);
  reader.onload = function () {
    $("#student-rankings >tbody").empty();
    console.log(reader.result);
    let jsonParsed = JSON.parse(reader.result);
    for (let prop in jsonParsed) {
      list.push(jsonParsed[prop]);
    }
    listofArr = list.map(function (obj) {
      return objFieldsList.map(function (key) {
        return obj[key];
      });
    });
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

function submitForm() {
  $.modal.close();
  let newEntry = [];
  let nameInput = document.querySelector("#name");
  let surnameInput = document.querySelector("#surname");
  let bioMark = document.querySelector("#bio");
  let algMark = document.querySelector("#alg");
  let sciMark = document.querySelector("#sci");
  let lang = document.querySelector("#lang");
  let chemMark = document.querySelector("#chem");
  let peMark = document.querySelector("#pe");
  let marksAvg = 0;
  marksAvg =
    +bioMark.value +
    +algMark.value +
    +sciMark.value +
    +lang.value +
    +chemMark.value +
    +peMark.value;
  newEntry = [
    `${nameInput.value} ${surnameInput.value}`,
    +bioMark.value,
    +algMark.value,
    +sciMark.value,
    +lang.value,
    +chemMark.value,
    +peMark.value,
    +`${(marksAvg / 6).toFixed(2)}`,
  ];
  listofArr.push(newEntry);
  console.log(newEntry);
  console.log(listofArr);
  let i = 1;
  const tr = document.createElement("tr");
  tr.className = "row100";
  newEntry.forEach((cell) => {
    const td = document.createElement("td");
    td.textContent = cell;
    td.className = `column100 column${i}`;
    td.dataset.column = `column${i}`;
    tr.appendChild(td);
    i++;
    if (i == 9) {
      const tdSpec = document.createElement("td");
      tdSpec.style.cursor = "pointer";
      //tdSpec.id = "delete-button";
      tdSpec.className = "column100 column9";
      tdSpec.dataset.column = "column9";
      tdSpec.style.paddingLeft = "10px";
      const deletebutton = document.createElement("button");
      deletebutton.className = "delete-button";
      deletebutton.textContent = "delete";
      deletebutton.style.height = "30px";
      $("#student-rankings").on("click", ".delete-button", function () {
        $(this).closest("tr").remove();
      });
      tdSpec.append(deletebutton);
      tr.appendChild(tdSpec);
    }
  });
  rankingsBody.appendChild(tr);
  arrayToJSONObject(listofArr);
  checkData();
  setHandlers();
}

$("#student-rankings").on("click", "#table-button", function () {
  $(this).closest("tr").remove();
});

$(function () {
  $("#student-rankings").tablesorter();
  setHandlers();
});

function arrayToJSONObject(matrix) {
  const finalObj = {};
  //header
  matrix.forEach((row, i) => {
    const studentId = `student${i}`;
    const student = {};
    objFieldsList.forEach((field, j) => {
      student[field] = row[j];
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
