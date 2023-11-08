let time = document.getElementById('time');
let navBar = document.querySelector('.navigationBar');
let infoBar = document.querySelector('.informationBar');
let content = document.querySelector('.content');

document.getElementById('close-msg')?.addEventListener('click', closeMessage);

document.getElementById('form-csv')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(document.getElementById('form-csv'));

    console.log(form);

    //leer datos del archivo y construir json
    const json = {};

    console.log(json);
    //enviar datos
    fetch('http://localhost:9000/subirCSV', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }).then((res) =>{
        if(!res.ok){
            throw new Error('Fallo la solicitud');
        }
        return res.json();
    }).then((res) => {
        alert(`Respuesta del servidor: ${JSON.stringify(res)}`);
    }).catch ((err) =>{
        alert(`Error: ${err}`);
    });
});

document.getElementById('update-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const form_data = new FormData(document.getElementById('update-form'));
    const json ={};
    form_data.forEach((v, k) =>{
        json[k] = v;
    });
    const url = document.location.href;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }).then((res) =>{
        if(!res.ok){
            throw new Error('Fallo la solicitud');
        }
        return res.json();
    }).then((res) => {
        alert(`Respuesta del servidor: ${JSON.stringify(res)}`);
        document.location.href = '/administrativo/administrarAmbientes';
    }).catch ((err) =>{
        alert(`Error: ${err}`);
    });
});

function createTableFromJSON(json){
    const table = document.createElement('table');
    let tr = document.createElement('tr');
    let cols = Object.keys(json[0]);
    cols.forEach(e =>{
        let th = document.createElement("th");
        th.innerText = e;
        tr.appendChild(th);
    });
    table.appendChild(tr);
    json.forEach(item =>{
        let tr = document.createElement('tr');
        let values = Object.values(item);
        values.forEach(v =>{
            let td = document.createElement('td');
            td.innerText = v;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    return table;
}

document.getElementById('ver-ambientes')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const form_data = new FormData(document.getElementById('ver-ambientes'));
    const json ={};
    form_data.forEach((v, k) =>{
        json[k] = v;
    });
    const url = document.location.href;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }).then((res) =>{
        if(!res.ok){
            throw new Error('Fallo la solicitud');
        }
        return res.json();
    }).then((res) => {
        /* alert(`Respuesta del servidor: ${JSON.stringify(res)}`); */
        const table = createTableFromJSON(res);
        const displayArea = document.getElementById('resultados-consulta');
        displayArea.innerHTML = '';
        displayArea.appendChild(table);
    }).catch ((err) =>{
        alert(`Error: ${err}`);
    });
});

window.addEventListener('load', (event) =>{
    /* logScreenSize(); */
    setTime();
});

/* function logScreenSize(){                       //Mutation Event Deprecated
  console.log(document.body.offsetWidth +
    'x' + document.body.offsetHeight);
} */

function setTime(){
  time.innerHTML = Date();
}

function closeMessage() {
    document.getElementById('message').classList.toggle('hide');
}

/* function editAmbiente(event){
    const row = event.target.closest('tr');
    try{
        fetch
    }
} */