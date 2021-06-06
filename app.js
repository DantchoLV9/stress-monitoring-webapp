const inputPopup = document.querySelector(".input-wrapper");
const inputPopupToggleButton = document.querySelector(".add-button");

inputPopupToggleButton.addEventListener("click", toggleInputPopup);

function toggleInputPopup() {
	inputPopup.classList.toggle("active");
	inputPopupToggleButton.classList.toggle("active");
}
