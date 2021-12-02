//Capture initial values to see if they have been updated
const initialTitle = document.querySelector("#problem_title").value.trim();
const initialSummary = document.querySelector("#problem_summary").value.trim();
const initialBuilding = document.querySelector("#building").value.trim();
const initialRoom = parseInt(document.querySelector("#room_number").value);

//const techButtonEls = document.getElementsByClassName("tech-button");

function updateTechList() {
    const techList = document.querySelector("#assigned-techs-list");
    techList.innerHTML = "";
    const techButtons = document.getElementsByClassName("tech-button");
    let techArr = [];
    for(let i = 0; i < techButtons.length; i++) {
        if(techButtons[i].classList.contains("isTech")) {
            techArr.push(techButtons[i].textContent);
        }
    }
    for(let i = 0; i < techArr.length; i++) {
        const nextLi = document.createElement("li");
        nextLi.textContent = techArr[i];
        techList.appendChild(nextLi);
    }
}

updateTechList();

const getTechs = () => {
    let output = [];
    const techButtons = document.getElementsByClassName("tech-button");
    for(let i = 0; i < techButtons.length; i++) {
        const isATech = techButtons[i].classList.contains("isTech");
        if(isATech) {
            output.push(parseInt(techButtons[i].getAttribute("data-userNo")));
        }
    }
    return output;
};

const initialTechs = getTechs();
console.log(initialTechs);

//console.log(techButtonEls);
//console.log(JSON.stringify(techButtonEls));


function switchClass(event) {
    event.preventDefault();
    
    const el = event.target;
    let buttonStatus =el.getAttribute("data-selected");
    //const elId = el.getAttribute("id");

    if(buttonStatus === "true") {
        el.classList.remove("isTech");
        el.classList.add("notTech");
        el.setAttribute("data-selected", "false");
    } else {
        el.classList.add("isTech");
        el.classList.remove("notTech");
        el.setAttribute("data-selected", "true");
    }
    updateTechList();
}

async function updateTicket(event) {
    event.preventDefault();

    const newTitle = document.querySelector("#problem_title").value.trim();
    const newSummary = document.querySelector("#problem_summary").value.trim();
    const newBuilding = document.querySelector("#building").value.trim();
    const newRoom = parseInt(document.querySelector("#room_number").value);

    const newTechs = getTechs();

    let sameTechs = initialTechs.length === newTechs.length;
    if(sameTechs) {
        for(let i = 0; i < initialTechs.length; i++) {
            if(initialTechs[i] !== newTechs[i]) {
                sameTechs = false;
                break;
            }
        }
    }

    const sameInfo = (newTitle === initialTitle && newSummary === initialSummary && newBuilding === initialBuilding && newRoom === initialRoom);

    console.log(`Same Techs?: ${sameTechs}\nSame Info?: ${sameInfo}`);

    const reqBody = {};
    if(!sameInfo) {
        if(newTitle !== initialTitle) {
            reqBody.problem_title = newTitle;
        }
        if(newSummary !== initialSummary) {
            reqBody.problem_summary = newSummary;
        }
        if(newBuilding !== initialBuilding) {
            reqBody.building = newBuilding;
        }
        if(newRoom !== initialRoom) {
            reqBody.room_number = newRoom;
        }
    }
    if(!sameTechs) {
        reqBody.assignTechs = newTechs;
    }

    if(Object.keys(reqBody).length > 0) {
        const response = await fetch(`/api/tickets/${window.location.toString().split('/')[window.location.toString().split('/').length - 1]}`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: { "Content-Type":"application/json" }
        });

        if(response.ok) {
            window.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    } else {
        alert('None of the data in the form were edited.  The database will not update if no new information is provided.');
    }
}

document.querySelector("#ticket-update-form").addEventListener("submit", updateTicket);