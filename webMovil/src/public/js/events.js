let info_ambiente = {};

let navBar = document.querySelector('.navigationBar');
let infoBar = document.querySelector('.informationBar');
let content = document.querySelector('.content');

document.getElementById('close-msg')?.addEventListener('click', closeMessage);

document.getElementById('form-csv')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(document.getElementById('form-csv'));

    console.log(form);

    //leer datos del archivo y construir json
    function leerCsv(evt){
                    
        let file = evt.target.files[0];
        let reader = new FileReader();
        reader.onload= (e) => {
          console.log(e.target.result)    
        };
        reader.readAsText(file);
    }
    document.querySelector('#archivocsv')
     .addEventListener('change',csv, false);
    
    

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

document.getElementById('reserva-ambiente')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const form_data = new FormData(document.getElementById('reserva-ambiente'));
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
        alert(`Respuesta del servidor: ${JSON.stringify(res)}`);
    }).catch ((err) =>{
        alert(`Error: ${err}`);
    });
});

function closeMessage() {
    document.getElementById('message').classList.toggle('hide');
}

function set_menu_button_events(){
    const menu_buttons = document.querySelectorAll('.nav-button');
    menu_buttons.forEach(button =>{
        button.addEventListener('click', (ev) =>{
            open_menu(button);
        });
    });
}

function set_form_events(){
    const search_form = document.getElementById('search-form');
    if(search_form){
        search_form.addEventListener('submit', (ev) =>{
            ev.preventDefault();
            search_available_ambiente(ev.target);
        });
    }
    const admin_add_edit_form = document.querySelector('#add-edit-ambient-modal form');
    if(admin_add_edit_form){
        admin_add_edit_form.addEventListener('submit', (ev) =>{
            ev.preventDefault();
            submit_admin_form(ev);
        });
    }
}

function set_modal_events(){
    const admin_edit_buttons = document.querySelectorAll('.admin-button');
    admin_edit_buttons.forEach(button =>{
        button.addEventListener('click', ev =>{
            ev.stopPropagation();
            admin_ambient(button);
        });
    });
}

window.addEventListener('load', async () =>{
    info_ambiente = await get_info_ambiente();
    set_time();
    set_menu_button_events();
    initialize_form_values();
    set_form_events();
    set_modal_events();
});