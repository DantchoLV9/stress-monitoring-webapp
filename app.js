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
const noDataMessage = document.querySelector(".no-data-message");
const content = document.querySelector(".content");

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
	Sets default values to chart range inputs
	Generates chart range dropdown dates
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
	}
};

// No Data Message

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

function setMaxValues() {
	rangeMonthInput.max = rangeMonthInput.value;
	rangeWeekInput.max = rangeWeekInput.value;
}

function setDefaultValues() {
	rangeMonthInput.valueAsDate = new Date();
	rangeWeekInput.valueAsDate = new Date();
}

function setMinValues() {
	let oldestDate = new Date(loadLocalStorage()[0][0]);
	let oldestYear = oldestDate.getFullYear();
	let oldestMonth =
		oldestDate.getFullYear() +
		"-" +
		(oldestDate.getMonth() > 8
			? oldestDate.getMonth() + 1
			: "0" + (oldestDate.getMonth() + 1));
	let oldestWeek = getWeekNumber(oldestDate);
	rangeMonthInput.min = oldestMonth;
	rangeWeekInput.min =
		oldestDate.getFullYear() +
		"-W" +
		(oldestWeek > 9 ? oldestWeek : "0" + oldestWeek);
	generateDates(oldestYear);

	console.log(getWeekNumber(oldestDate));
}

function getWeekNumber(date) {
	let dayNumberInWeek = new Date(date).getDay() + 1;
	let start = new Date(date.getFullYear(), 0, 0 - dayNumberInWeek);
	let difference =
		date -
		start +
		(start.getTimezoneOffset() - date.getTimezoneOffset() * 60 * 1000);
	let oneDay = 1000 * 60 * 60 * 24;
	let day = Math.round(difference / oneDay);
	let weekNumber = Math.ceil(day / 7);
	return weekNumber;
}

/* -------------------------------------------------------------------------------

+================================================================================+
| Backup function copied from internet if I find that the above one doesn't work |
+================================================================================+

Date.prototype.getWeekNumber = function () {
	var d = new Date(
		Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
	);
	var dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

------------------------------------------------------------------------------- */

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
	let localData = loadLocalStorage();
	if (localData.length === 1) {
		showDefaultContent();
		setDefaultValues();
		setMaxValues();
	}
	generateChart(localData);
	setMinValues();
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
