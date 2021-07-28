// getall

const baseURL = "http://localhost:8080";
const mainTableBody = document.querySelector("#mainTableBody");
const iclInput = document.querySelector("#icl");
const engInput = document.querySelector("#eng");
const posInput = document.querySelector("#pos");
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
    let newIcl = iclInput.value;
    let newEng = engInput.value;
    let newPos = posInput.value;
    let newWord = {icelandic:newIcl,english:newEng,pos:newPos};
    createWord(newWord);
    iclInput.value ="";
    engInput.value ="";
    posInput.value ="";
    iclInput.focus();
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


// ****************** run immediately ************************

showAll();

// renderer
