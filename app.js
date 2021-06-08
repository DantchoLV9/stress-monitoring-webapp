const inputPopupContainer = document.querySelector(".input-wrapper");
const inputPopup = document.querySelector(".input-popup");
const inputPopupToggleButton = document.querySelector(".add-button");
const inputSubmitButton = document.querySelector(".input-submit-button");
const inputForm = document.querySelector(".input-form");

// Event Listeners
inputPopupToggleButton.addEventListener("click", toggleInputPopup);
inputSubmitButton.addEventListener("click", (e) => {
	e.preventDefault();
	toggleInputPopup();
	processNewRecord();
});

// Set date input default value & limit
window.onload = () => {
	let { date } = inputForm.elements;
	date.valueAsDate = new Date();
	date.max = date.value;
};

// Input Popup Functions

function toggleInputPopup() {
	inputPopupContainer.classList.toggle("active");
	inputPopupToggleButton.classList.toggle("active");
	inputPopup.classList.toggle("active");
}

function processNewRecord() {
	let { date, stressLevel } = inputForm.elements;
	let newRecord = [];
	newRecord[0] = date.value;
	newRecord[1] = parseInt(stressLevel.value);
	saveLocalStorage(newRecord);
	generateChart(loadLocalStorage());
}

// Local Storage Functions

function loadLocalStorage() {
	let localData;
	if (localStorage.getItem("stressData") === null) {
		localData = [];
	} else {
		localData = JSON.parse(localStorage.getItem("stressData"));
	}
	return localData;
}

function saveLocalStorage(data) {
	let localData;
	let override = false;
	if (localStorage.getItem("stressData") === null) {
		localData = [];
	} else {
		localData = JSON.parse(localStorage.getItem("stressData"));
	}
	localData.forEach((element) => {
		if (element[0] === data[0]) {
			element[1] = data[1];
			override = true;
		}
	});
	if (!override) {
		localData.push(data);
	}
	localData.sort();
	localStorage.setItem("stressData", JSON.stringify(localData));
}

// Generate Chart

generateChart(loadLocalStorage());
