function set_time(){
    const time = document.getElementById('time');
    time.innerHTML = Date();
}

function json_object(string){
    try{
        const res = JSON.parse(string);
        return res;
    }
    catch(err){
        console.error(e.message);
        console.error('On string:', string);
    }
    return {};
}

async function request(url, method, form_data){
    try{
        const data = {};
        data.method = method;
        if(form_data){
            data.body = form_data;
        }
        const res = await fetch(url, data);
        if(res.ok){
            const string = await res.text();
            return json_object(string);
        }
    }
    catch(err){
        console.error(err.stack);
    }
    return [];
}

async function get_info_ambiente(){
    if(sessionStorage.info_ambiente){
        return JSON.parse(sessionStorage.info_ambiente);
    }
    else{
        const info = await request('api/info', 'GET');
        sessionStorage.info_ambiente = JSON.stringify(info.propiedades);
        return info.propiedades;
    }
}

function open_menu(button){
    if(button.classList.contains('nav-active')){
        close_menu(button);
    }
    else{
        const active = document.querySelector('.nav-active');
        if(active){
            close_menu(active);
        }
        const menu = button.querySelector('.nav-menu');
        button.classList.add('nav-active');
        menu.classList.remove('hide');
    }
}

function fill_search_periods(){
    const select = document.querySelector('#search-form select');
    if(select){
        const periodos = info_ambiente.periodos;
        periodos.forEach(periodo =>{
            const option = document.createElement('option');
            option.value = periodo.periodo;
            option.innerText = periodo.inicia + ' - ' + periodo.termina;
            select.appendChild(option);
        });
    }
}

function fill_admin_forms(){
    const admin_ambient_mod_form = document.getElementById('add-edit-ambient-modal');
    if(admin_ambient_mod_form){
        const select = admin_ambient_mod_form.querySelector('select[name="tipo"]');
        info_ambiente.tipos.forEach(tipo =>{
            const option = document.createElement('option');
            option.value = tipo;
            option.textContent = tipo;
            select.appendChild(option);
        });
    }
}

function initialize_form_values(){
    fill_search_periods();
    fill_admin_forms();
}

function close_menu(button){
    const menu = button.querySelector('.nav-menu');
    button.classList.remove('nav-active');
    menu.classList.add('hide');
}

function show_available_results(data){
    const result_field = document.getElementById('available-search-results');
    if(! data.length){
        result_field.innerText = 'No se ha encontrado ambientes';
    }
    else{
        result_field.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('data-table');
        let content = '<tr><th>Nombre</th><th>Capacidad</th><th>Ubicación</th></tr>';
        data.forEach(item =>{
            content += '<tr>';
            content += '<td>' + item.nombre + '</td>';
            content += '<td>' + item.capacidad + '</td>';
            content += '<td>' + item.ubicacion + '</td>';
            content += '</tr>';
        });
        table.innerHTML = content;
        result_field.appendChild(table);
    }
}

async function search_available_ambiente(form){
    const form_data = new FormData(form);
    const url = form.action + '?fecha=' + form_data.get('fecha') + '&horario=' + form_data.get('horario') +
        '&capacidad=' + form_data.get('capacidad');
    const data = await request(url, 'GET');
    show_available_results(data);
}

function set_admin_add_edit_values(form, values){
    form.querySelector('input[name="nombre"]').value = values.nombre;
    form.querySelector('input[name="ubicacion"]').value = values.ubicacion;
    form.querySelector('select[name="tipo"]').value = values.tipo;
    form.querySelector('input[name="capacidad"]').value = values.capacidad;
    form.querySelector('textarea[name="descripcion"]').value = values.descripcion;
}

async function admin_add_ambient(form){
    form.action ='/api/ambientes';
    form.method = 'POST';
    values = {nombre: "", ubicacion: "", tipo: "", capacidad: "", descripcion: ""};
    set_admin_add_edit_values(form, values);
    form.querySelector('input[type="submit"]').value = 'Añadir';
}

async function admin_edit_ambient(name, form){
    form.action = '/api/ambientes/' + name;
    form.method = 'PUT';
    const ambient_data = await request(form.action, 'GET');
    set_admin_add_edit_values(form, ambient_data[0]);
    form.querySelector('input[type="submit"]').value = 'Guardar';
}

function admin_ambient(origin){
    const type = origin.getAttribute('data-type');
    const modal = document.getElementById('add-edit-ambient-modal');
    const form = modal.querySelector('form');
    if(type === 'edit'){
        admin_edit_ambient(origin.getAttribute('data'), form);
    }
    else if(type === 'add'){
        admin_add_ambient(form);
    }
    modal.showModal();
}

function submit_admin_form(ev){
    const form = ev.target;
    console.log(form);
    console.log(form.method);
    if(form.method === 'PUT'){
        console.log('Here');
        const array = form.action.split('/');
        console.log(array);
        const name = array[array.length - 1];
        console.log(name);
    }
}