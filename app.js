const inputPopupContainer = document.querySelector(".input-wrapper");
const inputPopup = document.querySelector(".input-popup");
const inputPopupToggleButton = document.querySelector(".add-button");
const inputSubmitButton = document.querySelector(".input-submit-button");
const inputForm = document.querySelector(".input-form");
const chartModeInput = document.querySelector(".chart-mode");
const chartTitle = document.querySelector(".chart-title");
const rangeYearInput = document.querySelector(".range-year");
const rangeMonthInput = document.querySelector(".range-month");
const rangeWeekInput = document.querySelector(".range-week");

// Event Listeners
inputPopupToggleButton.addEventListener("click", toggleInputPopup);
inputSubmitButton.addEventListener("click", (e) => {
	e.preventDefault();
	toggleInputPopup();
	processNewRecord();
});
chartModeInput.addEventListener("change", changeChartMode);

/*
	Runs on page load
	Sets date input default value & limit
	Generates chart range dropdown dates
*/
window.onload = () => {
	let { date } = inputForm.elements;
	date.valueAsDate = new Date();
	date.max = date.value;
	generateDates(2000);
};

// Chart Controls

function changeChartMode() {
	switch (chartModeInput.value) {
		case "week":
			chartTitle.innerText = "Weekly Stress";
			rangeYearInput.classList.add("display-none");
			rangeMonthInput.classList.add("display-none");
			rangeWeekInput.classList.remove("display-none");
			break;
		case "month":
			chartTitle.innerText = "Monthly Stress";
			rangeYearInput.classList.add("display-none");
			rangeMonthInput.classList.remove("display-none");
			rangeWeekInput.classList.add("display-none");

			break;
		case "year":
			chartTitle.innerText = "Yearly Stress";
			rangeYearInput.classList.remove("display-none");
			rangeMonthInput.classList.add("display-none");
			rangeWeekInput.classList.add("display-none");

			break;
	}
}

function generateDates(startDate) {
	let endDate = new Date().getFullYear();
	for (let i = endDate; i >= startDate; i--) {
		let option = document.createElement("option");
		option.innerText = i;
		option.value = i;
		rangeYearInput.append(option);
	}
}

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
