// Input Popup Toggle Button
const inputPopupToggleButton = document.querySelector(".add-button");

// Input Popup
const inputPopupContainer = document.querySelector(".input-wrapper");
const inputPopup = document.querySelector(".input-popup");

// Input Popup Form
const inputForm = document.querySelector(".input-form");
const inputSubmitButton = document.querySelector(".input-submit-button");

// Chart Mode Input
const chartModeInput = document.querySelector(".chart-mode");

// Chart Range Input
const rangeYearInput = document.querySelector(".range-year");
const rangeMonthInput = document.querySelector(".range-month");
const rangeWeekInput = document.querySelector(".range-week");

// Chart Title
const chartTitle = document.querySelector(".chart-title");

// No Data Text
const noDataMessage = document.querySelector(".no-data-message");

// Main Content
const content = document.querySelector(".content");

// Chart Mode (Default: Week)
let chartMode = "week";

// Chart Ranges
let yearRange;
let monthRange;
let weekRange;

// ======================= Event Listeners =======================

// Input Pupup Toggle Button
inputPopupToggleButton.addEventListener("click", toggleInputPopup);

// Input Pupup Form
inputSubmitButton.addEventListener("click", (e) => {
	e.preventDefault();
	toggleInputPopup();
	processNewRecord();
});

// Chart Mode Input
chartModeInput.addEventListener("change", changeChartMode);

// Chart Range Inputs
rangeYearInput.addEventListener("change", getYearRange);
rangeMonthInput.addEventListener("change", getMonthRange);
rangeWeekInput.addEventListener("change", getWeekRange);

/*  ======================= Page Setup =======================

	Runs on page load.

	1. Sets the default value & limit value on the date input
	in the input pupup.

	2. Sets the default values on the chart range inputs.

	3. Generates dates for the year range input.

	4. Checks if the no data message should be shown.

	5. Get the default values of the range inputs.

*/
window.onload = () => {
	let { date } = inputForm.elements;
	date.valueAsDate = new Date();
	date.max = date.value;
	if (loadLocalStorage().length == 0) {
		hideDefaultContent();
	} else {
		setDefaultValues();
		setMaxValues();
		setMinValues();
		getYearRange();
		getMonthRange();
		getWeekRange();
	}
};

// ======================= Chart =======================

// ----------------------- Controls -----------------------

// Retrieve the Values of the Range Inputs

function getYearRange() {
	yearRange = parseInt(rangeYearInput.value);
	let localData = loadLocalStorage();
	generateChart(localData);
}

function getMonthRange() {
	monthRange = rangeMonthInput.value;
}

function getWeekRange() {
	weekRange = rangeWeekInput.value;
}

// Change the Mode of the Chart

function changeChartMode() {
	switch (chartModeInput.value) {
		case "week":
			chartTitle.innerText = "Weekly Stress";
			rangeYearInput.classList.add("display-none");
			rangeMonthInput.classList.add("display-none");
			rangeWeekInput.classList.remove("display-none");
			chartMode = "week";
			break;
		case "month":
			chartTitle.innerText = "Monthly Stress";
			rangeYearInput.classList.add("display-none");
			rangeMonthInput.classList.remove("display-none");
			rangeWeekInput.classList.add("display-none");
			chartMode = "month";
			break;
		case "year":
			chartTitle.innerText = "Yearly Stress";
			rangeYearInput.classList.remove("display-none");
			rangeMonthInput.classList.add("display-none");
			rangeWeekInput.classList.add("display-none");
			chartMode = "year";
			break;
	}
	let localData = loadLocalStorage();
	generateChart(localData);
}

// Set Max Values to Month & Week Range Inputs
function setMaxValues() {
	rangeMonthInput.max = rangeMonthInput.value;
	rangeWeekInput.max = rangeWeekInput.value;
}

// Set Min Values to Month & Week Range Inputs
function setMinValues() {
	let oldestDate = new Date(loadLocalStorage()[0][0]);
	let oldestYear = oldestDate.getFullYear();
	let oldestMonth =
		oldestDate.getFullYear() +
		"-" +
		(oldestDate.getMonth() > 8
			? oldestDate.getMonth() + 1
			: "0" + (oldestDate.getMonth() + 1));
	let oldestWeek = oldestDate.getWeekNumber();
	rangeMonthInput.min = oldestMonth;
	rangeWeekInput.min =
		oldestDate.getFullYear() +
		"-W" +
		(oldestWeek > 9 ? oldestWeek : "0" + oldestWeek);
	generateDates(oldestYear);
}

// Get the Number of the Week of a Given Date
Date.prototype.getWeekNumber = function () {
	var d = new Date(
		Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
	);
	var dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

// Set Default Values to Month & Week Range Inputs
function setDefaultValues() {
	rangeMonthInput.valueAsDate = new Date();
	rangeWeekInput.valueAsDate = new Date();
}

// ----------------------- Generation -----------------------

// Generate the Years for the Year Range Input
function generateDates(startDate) {
	rangeYearInput.innerHTML = "";
	let endDate = new Date().getFullYear();
	for (let i = endDate; i >= startDate; i--) {
		let option = document.createElement("option");
		option.innerText = i;
		option.value = i;
		rangeYearInput.append(option);
	}
}

// Process New Record
function processNewRecord() {
	let { date, stressLevel } = inputForm.elements;
	let newRecord = [];
	newRecord[0] = date.value;
	newRecord[1] = parseInt(stressLevel.value);
	saveLocalStorage(newRecord);
	let localData = loadLocalStorage();
	if (localData.length === 1) {
		showDefaultContent();
		setDefaultValues();
		setMaxValues();
	}
	generateChart(localData);
	setMinValues();
}

// ======================= Local Storage Functions =======================

function loadLocalStorage() {
	let localData;
	if (localStorage.getItem("stressData") === null) {
		localData = [];
	} else {
		localData = JSON.parse(localStorage.getItem("stressData"));
	}
	if (chartMode === "year") {
		console.log("Show records only for: " + yearRange);
	}
	if (chartMode === "month") {
		console.log("Show records only for: " + monthRange);
	}
	if (chartMode === "week") {
		console.log("Show records only for: " + weekRange);
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

// ======================= Other =======================

// Input Popup Function

function toggleInputPopup() {
	inputPopupContainer.classList.toggle("active");
	inputPopupToggleButton.classList.toggle("active");
	inputPopup.classList.toggle("active");
}

// -------------------- No Data Message --------------------

function showDefaultContent() {
	let children = Array.from(content.children);
	children.forEach((child) => {
		child.classList.remove("display-none");
	});
	noDataMessage.classList.add("display-none");
}

function hideDefaultContent() {
	let children = Array.from(content.children);
	children.forEach((child) => {
		child.classList.add("display-none");
	});
	noDataMessage.classList.remove("display-none");
}

// Generate Chart

generateChart(loadLocalStorage());
