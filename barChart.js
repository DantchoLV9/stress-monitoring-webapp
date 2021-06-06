const chartArea = document.querySelector(".chart");
const barsWrapper = chartArea.querySelector(".bars-wrapper");
const textWrapper = chartArea.querySelector(".text-wrapper");
const chartMode = "week";

// Creating Experimental Data
let data = [];
for (let i = 0; i < 7; i++) {
	data[i] = [];
	data[i][0] = "0" + (i + 1) + "/06/2021";
	data[i][1] = Math.floor(Math.random() * 5);
}
console.log(data);

function generateTable(data) {
	let chartHeight = barsWrapper.offsetHeight;
	console.log(chartHeight);
	data.forEach((item) => {
		console.log(item);
		createBar((chartHeight / 5) * item[1], item[0]);
		createBar((chartHeight / 5) * item[1], item[0]);
	});
}

function createBar(height, text) {
	let bar = document.createElement("div");
	bar.classList.add("bar");
	bar.style.height = height + "px";
	barsWrapper.appendChild(bar);

	let label = document.createElement("p");
	label.innerText = text;
	textWrapper.appendChild(label);
}

function clearChart() {
	barsWrapper.innerHTML = "";
	textWrapper.innerHTML = "";
}
