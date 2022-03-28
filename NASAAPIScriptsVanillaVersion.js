/* NASA API Project JS Scripts */
// Creates a new date object and sets it up for the API
const newDate = new Date();
const theCurrentYear = newDate.getFullYear();
const theCurrentMonth = newDate.getMonth() + 1;
const theCurrentDayOfTheMonth = newDate.getDate();
const todaysDate = assembleTheUrlDate(theCurrentYear, theCurrentMonth, theCurrentDayOfTheMonth);

// Sets up API quiery
const urlPart1 = "https://api.nasa.gov/planetary/apod?api_key=";
const api_key = "bDzyjsO3wPZ8wYRlx2orD1VBj7wDrclSttoUtPbn";
const urlPart3 = "&date=";
let urlDate = todaysDate;
const thumbs = "&thumbs=true";

// Disables/Enables the forwards and back buttons
function DisableEnableNextButtons() {
    if (urlDate == todaysDate) {
        document.getElementById("nextButton").disabled = true;
    }
    else {
        document.getElementById("nextButton").disabled = false;
    }
    if (urlDate == "1995-06-17") {
        document.getElementById("backButton").disabled = true;
    }
    else {
        document.getElementById("backButton").disabled = false;
    }
}
DisableEnableNextButtons()

// Formats the selected date for the API to use
function assembleTheUrlDate(year, month, day) {
    return year + "-" + month + "-" + day;
}

// API data fetch and writing the data
const fetchNASAData = async () => {
  try {
    const response = await fetch(`${urlPart1}${api_key}${urlPart3}${urlDate}${thumbs}`)
    const data = await response.json();
    const jsondataToGrab = data;
    console.log('NASA APOD data', data);
    document.getElementById("NASAphoto").src = data.url;
    document.getElementById("NASAphotoCaption").innerHTML = data.title;
    document.getElementById("videoLink").href = data.url;
    if (data.copyright == undefined) {
        document.getElementById("NASAphotoCaptionCopyright").innerHTML = "";
    }
    else {
        document.getElementById("NASAphotoCaptionCopyright").innerHTML = "by " + data.copyright;
    }
    document.getElementById("NASAphotoCaptionDescription").innerHTML = data.explanation;
    if (data.media_type == "video") {
        document.getElementById("NASAphoto").style.display = "none";
        document.getElementById("videoLink").style.display = "block";    
    }
    else {
        document.getElementById("NASAphoto").style.display = "inline-block";
        document.getElementById("videoLink").style.display = "none";    
    }
    /* 
    date: "2021-08-14"
    media_type: "image"
    
    */
  } catch (error) {
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
        else if (previousMonth == 1 || previousMonth == 3 || previousMonth == 5 || previousMonth == 7 || previousMonth == 8 || previousMonth == 10) {
            tempDayOfTheMonth = 31;
            tempMonth--;
        }
        else if (previousMonth === 4 || previousMonth === 6 || previousMonth === 9 || previousMonth === 11) {
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
    DisableEnableNextButtons()
}

function nextPhoto() {
    var urlParts = urlDate.match(/\d+/g);
    let tempYear = urlParts[0];
    let tempMonth = urlParts[1];
    let tempDayOfTheMonth = urlParts[2];
    if ((tempMonth == 1 || tempMonth == 3 || tempMonth == 5 || tempMonth == 7 || tempMonth == 8 || tempMonth == 10) && (tempDayOfTheMonth > 30)) {
            tempDayOfTheMonth = 1;
            tempMonth++;
    }
    else if ((tempMonth == 4 || tempMonth == 6 || tempMonth == 9 || tempMonth == 11) && (tempDayOfTheMonth > 29)) {
            tempDayOfTheMonth = 1;
            tempMonth++;
    }
    else if (tempMonth == 2 && tempDayOfTheMonth > 27) {
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
    DisableEnableNextButtons()
}

function selectTheDate() {
    selectedYear = document.getElementById('yearSelector').value;
    selectedMonth = document.getElementById('monthSelector').value;
    selectedDay = document.getElementById('daySelector').value;
    // Last possible image is "1995-06-17"
    if (selectedYear < 1995) {
        alert("Not a valid date. APOD started on May 17th, 1995")
    }
    else if ((selectedYear == 1995) && (selectedMonth < 6)) {
        alert("Not a valid date. APOD started on May 17th, 1995")
    }
    else if ((selectedYear == 1995) && (selectedMonth >= 6) && (selectedDay < 17)) {
        alert("Not a valid date. APOD started on May 17th, 1995")
    }
    else if (selectedYear > theCurrentYear) {
        alert("Not a valid date. APOD does not show future photos")
    }
    else if ((selectedYear == theCurrentYear) && (selectedMonth > theCurrentMonth)) {
        alert("Not a valid date. APOD does not show future photos")
    }
    else if ((selectedYear == theCurrentYear) && (selectedMonth == theCurrentMonth) && (selectedDay > theCurrentDayOfTheMonth)) {
        alert("Not a valid date. APOD does not show future photos")
    }
    else if ((selectedMonth == 4 || selectedMonth == 6 || selectedMonth == 9 || selectedMonth == 11) && (selectedDay > 30)) {
        alert("Not a valid date.")
    }
    else if ((selectedMonth == 2) && (selectedDay > 28)) {
        alert("Not a valid date.")
    }
    else {
        DisableEnableNextButtons()
        urlDate = assembleTheUrlDate(selectedYear, selectedMonth, selectedDay);
        fetchNASAData();
    }
}