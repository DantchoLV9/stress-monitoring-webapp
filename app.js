const inputPopup = document.querySelector(".input-wrapper");
const inputPopupToggleButton = document.querySelector(".add-button");
const inputSubmitButton = document.querySelector(".input-submit-button");
const inputForm = document.querySelector(".input-form");

// Event Listeners
inputPopupToggleButton.addEventListener("click", toggleInputPopup);
inputSubmitButton.addEventListener("click", (e) => {
	e.preventDefault();
	closeInputPopup();
	processNewRecord();
});

// Input Popup Functions

function toggleInputPopup() {
	inputPopup.classList.toggle("active");
	inputPopupToggleButton.classList.toggle("active");
}

function closeInputPopup() {
	inputPopup.classList.remove("active");
	inputPopupToggleButton.classList.remove("active");
}

function processNewRecord() {
	let { year, month, day, stressLevel } = inputForm.elements;
	let monthValue = getMonthFromString(month.value);
	let date = `${day.value}/${monthValue}/${year.value}`;
	let newRecord = [];
	newRecord[0] = date;
	newRecord[1] = parseInt(stressLevel.value);
	saveLocalStorage(newRecord);
}

function getMonthFromString(month) {
	let months = [
		"january",
		"february",
		"march",
		"april",
		"may",
		"june",
		"july",
		"august",
		"september",
		"october",
		"november",
		"december",
	];
	let monthIndex = months.findIndex((monthName) => monthName === month);
	return monthIndex + 1;
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
	localStorage.setItem("stressData", JSON.stringify(localData));
}
