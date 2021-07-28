// getall

const baseURL = "http://localhost:8080";
const mainTableBody = document.querySelector("#mainTableBody");

//show all, calling render word for each item
const showAll = () => {
    console.log("hi");
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
    const newRow = document.createElement('tr');

    const idCell = document.createElement('td');
    const iclCell = document.createElement('td');
    const engCell = document.createElement('td');
    const posCell = document.createElement('td');
    const scoreCell = document.createElement('td');


    const idDiv = document.createElement('div');
    const iclDiv = document.createElement('div');
    const engDiv = document.createElement('div');
    const posDiv = document.createElement('div');
    const scoreDiv = document.createElement('div');

    idDiv.innerText=word.id;
    iclDiv.innerText=word.icelandic;
    engDiv.innerText=word.english;
    posDiv.innerText=word.pos;
    scoreDiv.innerText=word.score;

    const delCell = document.createElement('td');
    const delButton = document.createElement('button');
    delButton.innerText="Delete";
    delCell.appendChild(delButton);

    const cells = [idCell, iclCell, engCell, posCell, scoreCell];
    const divs = [idDiv, iclDiv, engDiv, posDiv, scoreDiv];

    for (let i = 0; i < cells.length; i++) {
        cells[i].appendChild(divs[i]);
        newRow.appendChild(cells[i]);
    }

    newRow.appendChild(delCell);

    section.appendChild(newRow);

}

showAll();

// renderer
