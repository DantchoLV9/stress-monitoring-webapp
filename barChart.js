const chartArea = document.querySelector(".chart");

// Creating Experimental Data
let data = [];
for (let i = 0; i < 7; i++) {
	data[i] = [];
	data[i][0] = "0" + (i + 1) + "/06/2021";
	data[i][1] = Math.floor(Math.random() * 5);
}
console.log(data);

function createBar(height) {
	let bar = document.createElement("div");
	bar.classList.add("bar");
	bar.style.height = height + "px";
	chartArea.appendChild(bar);
}

function clearChart() {
	chartArea.innerHTML = "";
}
