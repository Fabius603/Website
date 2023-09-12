"use strict";

const selectsearchcontainer = document.querySelector(".container-select-search"),
selectsearchbutton = selectsearchcontainer.querySelector(".button-select-search"),
selectsearchinput = selectsearchcontainer.querySelector("input"),
selectoptions = selectsearchcontainer.querySelector(".options-select-search");

// This array of strings needs to come from the backend obv.
let optiondata = [
"DIN A4, 80g/m2, matt, Z-Falz",
"DIN A4, 90g/m2, matt, Z-Falz",
"DIN A4, 120g/m2, matt, Z-Falz",
"DIN A4, 160g/m2, matt, Z-Falz",
"DIN A4, 180g/m2, matt, Z-Falz",
"DIN A4, 80g/m2, matt, V-Falz",
"DIN A4, 90g/m2, matt, V-Falz",
"DIN A4, 120g/m2, matt, V-Falz",
"DIN A4, 160g/m2, matt, V-Falz",
"DIN A4, 180g/m2, matt, V-Falz",
"DIN A4, 80g/m2, glänzend, Z-Falz",
"DIN A4, 90g/m2, glänzend, Z-Falz",
"DIN A4, 120g/m2, glänzend, Z-Falz",
"DIN A4, 160g/m2, glänzend, Z-Falz",
"DIN A4, 180g/m2, glänzend, Z-Falz",
"DIN A4, 80g/m2, glänzend, V-Falz",
"DIN A4, 90g/m2, glänzend, V-Falz",
"DIN A4, 120g/m2, glänzend, V-Falz",
"DIN A4, 160g/m2, glänzend, V-Falz",
"DIN A4, 180g/m2, glänzend, V-Falz",
"US Letter, 80g/m2, matt, Z-Falz",
"US Letter, 90g/m2, matt, Z-Falz",
"US Letter, 120g/m2, matt, Z-Falz",
"US Letter, 160g/m2, matt, Z-Falz",
"US Letter, 180g/m2, matt, Z-Falz",
"US Letter, 80g/m2, matt, V-Falz",
"US Letter, 90g/m2, matt, V-Falz",
"US Letter, 120g/m2, matt, V-Falz",
"US Letter, 160g/m2, matt, V-Falz",
"US Letter, 180g/m2, matt, V-Falz",
"US Letter, 80g/m2, glänzend, Z-Falz",
"US Letter, 90g/m2, glänzend, Z-Falz",
"US Letter, 120g/m2, glänzend, Z-Falz",
"US Letter, 160g/m2, glänzend, Z-Falz",
"US Letter, 180g/m2, glänzend, Z-Falz",
"US Letter, 80g/m2, glänzend, V-Falz",
"US Letter, 90g/m2, glänzend, V-Falz",
"US Letter, 120g/m2, glänzend, V-Falz",
"US Letter, 160g/m2, glänzend, V-Falz",
"US Letter, 180g/m2, glänzend, V-Falz"
];

function addData(selectedData) {
    selectoptions.innerHTML = "";
    optiondata.forEach(option => {
        let isSelected = option == selectedData ? "selected" : "";
        let li = `<li onclick="updateName(this)" class="${isSelected}">${option}</li>`;
        selectoptions.insertAdjacentHTML("beforeend", li);
    });
}

addData();

function updateName(selectedLi) {
    selectsearchinput.value = "";
    addData(selectedLi.innerText);
    selectsearchcontainer.classList.remove("active");
    selectsearchbutton.firstElementChild.innerText = selectedLi.innerText;
}

selectsearchinput.addEventListener("keyup", () => {
    let resultarr = [];
    let selectquery = selectsearchinput.value.toLowerCase();
    resultarr = optiondata.filter(data => {
        return data.toLowerCase().startsWith(selectquery);
    }).map(data => {
        let isSelected = data == selectsearchbutton.firstElementChild.innerText ? "selected" : "";
        return `<li onclick="updateName(this)" class="${isSelected}">${data}</li>`;
    }).join("");
    selectoptions.innerHTML = resultarr ? resultarr : `<p>Eintrag nicht gefunden!</p>`;
});

selectsearchbutton.addEventListener("click", () => selectsearchcontainer.classList.toggle("active"));