// Creates a new date object and sets it up for the API
const newDate = new Date();
const theCurrentYear = newDate.getFullYear();
const theCurrentMonth = newDate.getMonth() + 1;
const theCurrentDayOfTheMonth = newDate.getDate();
const todaysDate = assembleTheUrlDate(theCurrentYear, theCurrentMonth, theCurrentDayOfTheMonth);

const monthsWith30Days = ["04", "06", "09", "11", 4, 6, 9, 11];
const monthsWith31Days = ["01", "03", "05", "07", "08", "10", 1, 3, 5, 7, 8, 10];

document.getElementById("datePicker").setAttribute("max", todaysDate);
document.getElementById("datePicker").setAttribute("value", todaysDate);


const urlPart1 = "https://api.nasa.gov/planetary/apod?api_key=";
const api_key = "bDzyjsO3wPZ8wYRlx2orD1VBj7wDrclSttoUtPbn";
const urlPart3 = "&date=";
let urlDate = todaysDate;
const thumbs = "&thumbs=true";


function disableEnableNextButtons() {
	document.getElementById("nextButton").disabled = false;
	document.getElementById("backButton").disabled = false;
	if (urlDate == todaysDate) {
		document.getElementById("nextButton").disabled = true;
	}
	if (urlDate == "1995-06-16") {
		document.getElementById("backButton").disabled = true;
	}
}
disableEnableNextButtons()


function assembleTheUrlDate(year, month, day) {
	if (month.toString().length === 1) {
		month = "0" + month;
	}
	return year + "-" + month + "-" + day;
}


const fetchNASAData = async () => {
	try {
		const response = await fetch(`${urlPart1}${api_key}${urlPart3}${urlDate}${thumbs}`)
		const data = await response.json();
		console.log(data);
		if (data.url != undefined) {
			document.getElementById("photo").src = data.url;
		}
		document.getElementById("photo-caption").innerHTML = data.title;
		document.getElementById("photo-date").innerHTML = data.date;
		document.getElementById("photo-description").innerHTML = data.explanation;
		if (data.copyright == undefined) {
			document.getElementById("photo-caption-copyright").innerHTML = "";
		}
		else {
			document.getElementById("photo-caption-copyright").innerHTML = "by " + data.copyright;
		}

		if (data.media_type === "video") {
			document.getElementById("photo").style.display = "none";
			document.getElementById("video").style.display = "block";
			document.getElementById("video").setAttribute("src", data.url);
		}
		else {
			document.getElementById("photo").style.display = "block";
			document.getElementById("video").style.display = "none";
		}

		if (data.code == 404) {
			document.getElementById("photo").src = "files-nasa-api/observatory.svg";
			document.getElementById("photo-caption").innerHTML = "NASA does not have a photo for " + urlDate;
			document.getElementById("photo-description").innerHTML = data.msg;
			document.getElementById("photo-date").innerHTML = urlDate;

		}
	} catch (error) {
		console.log(data);
		console.log(error);
	}
};
fetchNASAData();


function previousPhoto() {
	let urlParts = urlDate.match(/\d+/g);
	let tempYear = urlParts[0];
	let tempMonth = urlParts[1];
	let tempDayOfTheMonth = urlParts[2];
	let previousMonth = tempMonth - 1;
	if (tempDayOfTheMonth == 1) {
		if (previousMonth === 0) {
			tempDayOfTheMonth = 31;
			tempMonth = 12;
			tempYear--;
		}
		else if (monthsWith31Days.includes(previousMonth)) {
			tempDayOfTheMonth = 31;
			tempMonth--;
		}
		else if (monthsWith30Days.includes(previousMonth)) {
			tempDayOfTheMonth = 30;
			tempMonth--;
		}
		else if (previousMonth === 2) {
			tempDayOfTheMonth = 28;
			tempMonth--;
		}
	}
	else {
		tempDayOfTheMonth--;
	}
	let newURLDate = assembleTheUrlDate(tempYear, tempMonth, tempDayOfTheMonth);
	urlDate = newURLDate;
	fetchNASAData();
	disableEnableNextButtons()
}


function nextPhoto() {
	var urlParts = urlDate.match(/\d+/g);
	let tempYear = urlParts[0];
	let tempMonth = urlParts[1];
	let tempDayOfTheMonth = urlParts[2];
	if ((monthsWith31Days.includes(tempMonth)) && (tempDayOfTheMonth > 30)) {
		tempDayOfTheMonth = 1;
		tempMonth++;
	}
	else if ((monthsWith30Days.includes(tempMonth)) && (tempDayOfTheMonth > 29)) {
		tempDayOfTheMonth = 1;
		tempMonth++;
	}
	else if (tempMonth == "02" && tempDayOfTheMonth > 27) {
		tempDayOfTheMonth = 1;
		tempMonth++;
	}
	else if (tempMonth == 12 && tempDayOfTheMonth > 30) {
		tempDayOfTheMonth = 1;
		tempMonth = 1;
		tempYear++;
	}
	else {
		tempDayOfTheMonth++;
	}
	let newURLDate = assembleTheUrlDate(tempYear, tempMonth, tempDayOfTheMonth);
	urlDate = newURLDate;
	fetchNASAData();
	disableEnableNextButtons()
}


function selectTheDate() {
	if (isNotValidPictureDate()) {
		return null;
	}
	let datePickerValue = document.getElementById("datePicker").value;
	urlDate = datePickerValue;
	fetchNASAData();
	disableEnableNextButtons();
}


function isNotValidPictureDate() {
	// Earliest possible image is "1995-06-16"
	let datePickerValue = document.getElementById("datePicker").value;
	let dateParts = datePickerValue.split("-");
	let selectedYear = dateParts[0];
	let selectedMonth = dateParts[1];
	let selectedDay = dateParts[2];

	if ((selectedYear < 1995)) {
		alert("Not a valid date. APOD started on June 16th, 1995");
		return true;
	}
	else if ((selectedYear <= 1995) && (selectedMonth < 6)) {
		alert("Not a valid date. APOD started on June 16th, 1995")
		return true;
	}
	else if ((selectedYear == 1995) && (selectedMonth >= 6) && (selectedDay < 16)) {
		alert("Not a valid date. APOD started on June 16th, 1995")
		return true;
	}


	else if (selectedYear > theCurrentYear) {
		alert("Not a valid date. APOD does not show future photos")
		return true;
	}
	else if ((selectedYear == theCurrentYear) && (selectedMonth > theCurrentMonth)) {
		alert("Not a valid date. APOD does not show future photos")
		return true;
	}
	else if ((selectedYear == theCurrentYear) && (selectedMonth == theCurrentMonth) && (selectedDay > theCurrentDayOfTheMonth)) {
		alert("Not a valid date. APOD does not show future photos")
		return true;
	}


	else if ((monthsWith30Days.includes(selectedMonth)) && (selectedDay > 30)) {
		alert("Not a valid date.")
		return true;
	}
	else if ((selectedMonth == 2) && (selectedDay > 28)) {
		alert("Not a valid date.")
		return true;
	}
	return false;
}