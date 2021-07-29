'use strict';

// getall

const baseURL = "http://localhost:8080";
const mainTableBody = document.querySelector("#mainTableBody");
const createForm = document.querySelector("#createForm");

//*********************************SHOW ALL, calling render word for each item*************************
const showAll = () => {
    mainTableBody.innerHTML="";

    axios.get(`${baseURL}/getAll`)
        .then(res => {
            const words = res.data;
            words.forEach(word => {
                renderWord(word, mainTableBody);
                // console.log(word);
            })
        }).catch(err => console.log(err));
}

//*********************render word as row in tbody******************************
const renderWord = (word, section) => {
    //create row
    const newRow = document.createElement('tr');
    newRow.id = word.id; //adds word id as row id

    // create cells
    const iclCell = document.createElement('td');
    const engCell = document.createElement('td');
    const posCell = document.createElement('td');
    const scoreCell = document.createElement('td');

    //2d array for cells and values
    const cellsVals = [[iclCell, word.icelandic], [engCell, word.english], [posCell,word.pos], [scoreCell,word.score]];

    for (let i = 0; i < cellsVals.length; i++) {
        let subDiv = document.createElement('div');
		//subdiv needs onclick function added here for update function
        subDiv.addEventListener('click', (e) => divToInput(e.target, i));
		
        subDiv.innerText = cellsVals[i][1];
        cellsVals[i][0].appendChild(subDiv);
        newRow.appendChild(cellsVals[i][0]);
    }
    
    //insert delete button
    const delCell = document.createElement('td');
    const delButton = document.createElement('button');
    delButton.innerText="Delete";
    
    delButton.addEventListener('click', function(e) {
        deleteById(word.id);
    });
    
    
    delCell.appendChild(delButton);
    newRow.appendChild(delCell);

    section.appendChild(newRow);

}

//*************************************CREATE NEW **********************************************
const createWord = (newWord) => {
    //post new word with create request
    axios.post(`${baseURL}/create`, newWord)
    .then(res => {
        showAll(); //call show all to refresh with new word added
    }).catch(err => console.log(err));

}

//apply above function to 'add word' button
createForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const thisForm = e.target;

    let newIcl = thisForm.icl.value;
    let newEng = thisForm.eng.value;
    let newPos = thisForm.pos.value;
    let newWord = {icelandic:newIcl,english:newEng,pos:newPos};
    createWord(newWord);
    thisForm.icl.value ="";
    thisForm.eng.value ="";
    thisForm.pos.value ="";
    thisForm.icl.focus();
})

//************************************DELETE BY ID *****************************************/
const deleteById = (id) => {
    axios.delete(`${baseURL}/delete/${id}`)
    .then(res => {
        showAll();
    }).catch(err => console.log(err));
}


//*************************************REPLACE BY ID ******************************************/
const replace = (id, replacementWord) => {
    axios.put(`${baseURL}/update/${id}`, replacementWord)
    .then(res => {
        showAll();
    }).catch(err => console.log(err));
}

//converts divs in getall table to text inputs
const divToInput= (thisDiv, colNo) => {
    //create input
    const newInput = document.createElement('input');
    newInput.type = "text";
    newInput.class = "specialInput";
	
    newInput.style.width=(thisDiv.parentElement.offsetWidth * 0.75) + "px";
    newInput.value = thisDiv.innerText;
    //event listener for input
    newInput.addEventListener('focusout', (e) => inputToDiv(e.target));
    newInput.addEventListener('keydown', function (e) {
        //handle enter keypress
        if (e.key === 'Enter') {
            e.preventDefault();
            createForm.icl.focus();
        }

        
        
    });

    //make div invisible
    thisDiv.classList.add("hidden");

    //insert input into parent td
    thisDiv.parentElement.appendChild(newInput);
    newInput.focus();
}


//converts text inputs back to divs, and submits updated values as replacement word
const inputToDiv = (thisInput) => {
    const thisDiv = thisInput.parentElement.querySelector("div"); //get corresponding div
    
    //test if input has altered value: if not, skip put request
    if (thisDiv.innerText !== thisInput.value) {
        //sync hidden dv with input
        thisDiv.innerText = thisInput.value;

        //get values from tr (two parents up from input)
        const thisRow = thisInput.parentElement.parentElement; 
        let thisId = thisRow.id;
        let thisIcl = thisRow.querySelectorAll("td > div")[0].innerText;
        let thisEng = thisRow.querySelectorAll("td > div")[1].innerText;
        let thisPos = thisRow.querySelectorAll("td > div")[2].innerText;
        let thisScore = thisRow.querySelectorAll("td > div")[3].innerText;
        let thisWord = {icelandic:thisIcl,english:thisEng,pos:thisPos,score:thisScore}; //create replacement word

        // call replace using replacement word
        replace(thisId, thisWord);

    }
    thisInput.parentElement.querySelector("div").classList.remove("hidden");
    thisInput.remove();
}

//********************** populate test **************************************
const testIcl = document.querySelector("#testIcl");
const testAns = document.querySelector("#testAns");
const ansButton = document.querySelector("#ansButton");
const nextButton = document.querySelector("#nextButton");
const ansText = document.querySelector("#answer");
const testForm = document.querySelector("#testForm");
const idText = document.querySelector("#idField");
const ansAck = document.querySelector("#ansAck");

const getRandom = () => {
    axios.get(`${baseURL}/getRandom`)
    .then(res => {
        testIcl.innerText = res.data.icelandic;
        answer.innerText = res.data.english;
        idText.innerText = res.data.id;
    }).catch(err => console.log(err))
};


//************************** evaluate test ******************************
testForm.addEventListener('submit', function(e) {
    e.preventDefault();
    testResults(e.target);
})
    
// test results
const testResults = (thisForm) => {
    const givenAnswer = testAns.value;
    const actualAnswer = ansText.innerText;
    const wordId = idText.innerText;
    

    if (givenAnswer === actualAnswer) {
        ansAck.className="correct";
        ansAck.innerText = "Correct!";
        testAns.classList.add("right");
        // do patch for id item: get id, update score + 1 in backend.
        axios.patch(`${baseURL}/addScore/${wordId}`)
        .then(res => {
            console.log(res.data);
            spinner();
            showAll();
            
        }).catch(err => console.log(err));
    } else {
        ansAck.className="incorrect";
        ansAck.innerText = `Wrong! The correct answer is "${actualAnswer}".`;
        testAns.classList.add("wrong");
        getRandom();
        
    }
    // hide submit button, show next button
    testAns.classList.add("disabled");
    ansButton.classList.add("hidden");
    nextButton.classList.remove("hidden");
    nextButton.focus();
    testAns.disabled= true;
}

nextButton.addEventListener('click', function(e) {
    getRandom();
    ///hide next button, show submit button, and load new test word
    nextButton.classList.add("hidden");
    ansButton.classList.remove("hidden");
    testAns.classList.remove("right");
    testAns.classList.remove("wrong");
    ansAck.innerText ="";
    testAns.value = "";
    testAns.disabled= false;
    testAns.focus();
});


// make flags spin
const spinner = () => {
    document.querySelectorAll("img").forEach(image => {
        image.classList.remove("spin");
        void image.offsetWidth;
        image.classList.add("spin");
    });
};

// ****************** run immediately ************************
showAll();
getRandom();