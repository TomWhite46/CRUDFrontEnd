// getall

const baseURL = "http://localhost:8080";
const mainTableBody = document.querySelector("#mainTableBody");

//show all, calling render word for each item
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

//render word in table
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
    delCell.appendChild(delButton);
    newRow.appendChild(delCell);

    section.appendChild(newRow);

}

showAll();

// renderer
