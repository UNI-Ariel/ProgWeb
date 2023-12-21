function set_time(){
    const time = document.getElementById('time');
    time.innerHTML = Date();
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

function close_menu(button){
    const menu = button.querySelector('.nav-menu');
    button.classList.remove('nav-active');
    menu.classList.add('hide');
}

async function fill_search_periods(){
    const select = document.querySelector('#search-form select');
    const periodos = (await get_info_ambiente()).periodos;
    periodos.forEach(periodo =>{
        const option = document.createElement('option');
        option.value = periodo.periodo;
        option.innerText = periodo.inicia + ' - ' + periodo.termina;
        select.appendChild(option);
    });    
}

async function search_available_ambiente(form){
    const form_data = new FormData(form);
    const url = form.action + '?fecha=' + form_data.get('fecha') + '&horario=' + form_data.get('horario') +
        '&capacidad=' + form_data.get('capacidad');
    const data = await api_request(url, 'GET');
    if(data.code >= 200 && data.code < 300){
        show_available_search_results(data.body);
    }
    else{
        display_message(data.body);
    }
}

function show_available_search_results(data){
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

async function fill_admin_form_selectables(){
    const modal = document.getElementById('add-edit-ambient-modal');
    const select = modal.querySelector('select[name="tipo"]');
    const info = await get_info_ambiente();    
    info.tipos.forEach(tipo =>{
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });
    const fieldset = modal.querySelector('fieldset');
    info.facilidades.forEach(facilidad =>{
        const label = document.createElement('label');
        label.classList.add('flex-row', 'flex-gap-s', 'align-baseline', 'select-none');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'facilidades';
        input.value = facilidad;
        label.appendChild(input);
        label.innerHTML += facilidad;
        fieldset.appendChild(label);
    });
}

async function fill_booking_form_selectables(){
    const form = document.getElementById('booking-form');
    const select = form.querySelector('select[name="tipo"]');
    const info = await get_info_ambiente();
    info.tipos.forEach(tipo =>{
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });
    const fieldset = form.querySelector('fieldset');
    info.facilidades.forEach(facilidad =>{
        const label = document.createElement('label');
        label.classList.add('flex-row', 'flex-gap-s', 'align-baseline', 'select-none');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'facilidades';
        input.value = facilidad;
        label.appendChild(input);
        label.innerHTML += facilidad;
        fieldset.appendChild(label);
    });
    const periodos = form.querySelector('select[name="horario"]');
    info.periodos.forEach(periodo =>{
        const option = document.createElement('option');
        option.value = periodo.periodo;
        option.innerText = periodo.inicia + ' - ' + periodo.termina;
        periodos.appendChild(option);
    });    
}

function custom_modal_btn_action(btn){
    const action = btn.getAttribute('data-action');
    if(action === 'close-modal'){
        close_modal(btn);
    }
    else{
        console.error('Undefined action for modal button', btn);
    }
}

function set_message(msg){
    window.localStorage.setItem('displayMSG', msg);
}

function check_message(){
    const msg = window.localStorage.getItem('displayMSG');
    if(msg){
        display_message(msg);
        window.localStorage.removeItem('displayMSG');
    }
}

function display_message(msg){
    const msg_modal = document.getElementById('message-modal');
    msg_modal.querySelector('.custom-modal-content').innerText = msg;
    show_modal(msg_modal);
}

function show_modal(modal){
    if( ! modal.classList.contains('custom-modal')){
        modal = modal.closest('.custom-modal');
    }
    if( ! modal ){
        console.error('Open modal requires the modal element or one of its children:', modal);
    }
    else{
        modal.classList.remove('hide');
        document.body.classList.add('modal-open');
    }
}

function close_modal(modal){
    if( ! modal.classList.contains('custom-modal')){
        modal = modal.closest('.custom-modal');
    }
    if( ! modal ){
        console.error('Close modal requires the modal element or one of its children:', modal);
    }
    else{
        modal.classList.add('hide');
        document.body.classList.remove('modal-open');
    }
}

function admin_ambient(origin){
    let modal = document.getElementById('add-edit-ambient-modal');
    const type = origin.getAttribute('data-type');
    if(type === 'add'){
        admin_add_ambient();
    }
    else if(type === 'edit'){
        admin_edit_ambient( origin.getAttribute('data') );
    }
    else if(type === 'delete'){
        modal = document.getElementById('delete-ambient-modal');
        admin_del_ambient( origin.getAttribute('data') );
    }
    show_modal(modal);
}

function get_json_data_from_form(form){
    const json = {};
    const data = new FormData(form);
    data.forEach( (v, k) =>{
        if(! Reflect.has(json, k)  ){
            json[k] = v;
            return;
        }
        if( ! Array.isArray(json[k])){
            json[k] = [json[k]];
        }
        json[k].push(v);
    });
    return json;
}

async function search_ambient_booking(form){
    const data = get_json_data_from_form(form);
    const params = new URLSearchParams();
    for (const key in data) {
        if ( ! data[key] ) {
            delete data[key];
        }
        else{
            if(Array.isArray(data[key])){
                data[key].forEach(v =>{
                    params.append(key, v);
                });
            }
            else{
                params.append(key, data[key]);
            }
        }
      }
    const url = '/api/booking?' + params.toString();
    const res = await api_request(url, 'GET');
    if(res.code >= 200 && res.code < 300){
        show_booking_results(res.body);
    }
    else{
        display_message(res.body);
    }
}

function create_booking_table(data){
    const table = document.createElement('table');
    table.classList.add('data-table');
    let content = '<tr><th>Nombre</th><th>Cap.</th><th>Ubicación</th><th>Res.</th></tr>';
    data.forEach(item =>{
        content += '<tr>';
        content += '<td>' + item.nombre + '</td>';
        content += '<td>' + item.capacidad + '</td>';
        content += '<td>' + item.ubicacion + '</td>';
        content += '<td><button class="booking-btn" data="' + item.nombre + '">&#128366;</button></td>';
        content += '</tr>';
    });
    table.innerHTML = content;
    const buttons = table.querySelectorAll('.booking-btn');
    buttons.forEach(btn =>{
        btn.addEventListener('click', ev =>{
            ev.stopPropagation();
            open_booking_modal(btn);
        });
    });
    return table;
}

async function handle_booking_submision(form){
    const data = get_json_data_from_form(form);
    const url = '/api/booking/' + data.nombre;
    delete data["nombre"];
    const result = await api_request(url, 'POST', JSON.stringify(data));
    if(result.code >= 200 && result.code < 300){
        const modal = document.getElementById('confirm-booking-modal');
        const btn = document.getElementById('booking-results').querySelector('.page-button');
        close_modal(modal);
        btn.click();
    }
    display_message(result.body);
}

function handle_booking_admin_action(btn){
    const modal = document.getElementById('booking-action-modal');
    const title = modal.querySelector('.custom-modal-title');
    const action = btn.getAttribute('data-action');
    const reserva = btn.getAttribute('data');
    const form = modal.querySelector('form');
    const res = form.querySelector('input[name="reserva"]');
    const act = form.querySelector('input[name="action"]');
    const submit = form.querySelector('input[type="submit"]');
    res.value = reserva;
    const row = btn.closest('tr');
    const nombre = row.querySelector('td');
    const fecha = nombre.nextElementSibling;
    modal.querySelector('.action-text').innerHTML = 'Nombre: ' + nombre.innerText + '<br/>Fecha: ' + fecha.innerText;
    if(action === 'accept'){
        title.innerHTML = "Aceptar Reserva?";
        act.value = "accept";
        submit.value = "Aceptar";
    }
    else if(action === 'reject'){
        title.innerHTML = "Rechazar Reserva?";
        act.value = "reject";
        submit.value = "Rechazar";
    }
    else{
        console.error('Unknow action:', action);
    }
    show_modal(modal);
}

async function handle_booking_action_form_submit(form){
    const data = get_json_data_from_form(form);
    const url = '/api/bookings/' + data.reserva;
    const responce = await api_request(url, 'POST', JSON.stringify(data));
    if(responce.code >= 200 && responce.code < 300){
        set_message(responce.body);
        document.location.reload();
    }
    display_message(responce.body);
}

function open_booking_modal(btn){
    const booking_modal = document.getElementById('confirm-booking-modal');
    const form = document.getElementById('booking-search').querySelector('form');

    const nombre = btn.getAttribute('data');
    const fecha = form.querySelector('input[name="fecha"]').value;
    const horario = form.querySelector('select[name="horario"]');

    booking_modal.querySelector('.nombre-ambiente').innerText = nombre;
    booking_modal.querySelector('.fecha-ambiente').innerText = fecha;
    booking_modal.querySelector('.horario-ambiente').innerText = horario.options[horario.selectedIndex].text;
    booking_modal.querySelector('input[name="nombre"]').value = nombre;
    booking_modal.querySelector('input[name="fecha"]').value = fecha;
    booking_modal.querySelector('input[name="horario"]').value = horario.value;
    show_modal(booking_modal);
}

function show_booking_results(data){
    const search = document.getElementById('booking-search');
    const results = document.getElementById('booking-results');
    const content = results.querySelector('.scroll-box');
    content.innerHTML = '';
    content.appendChild(create_booking_table(data));
    search.classList.add('hide');
    results.classList.remove('hide');
}

function admin_add_ambient(){
    const url = '/api/ambientes';
    set_admin_form_values('Nuevo Ambiente', url, 'POST', {}, 'Añadir');
    const form = document.querySelector('#add-edit-ambient-modal form');
    form.addEventListener('submit', async ev =>{
        ev.preventDefault();
        const json_data = get_json_data_from_form(form);
        const responce = await api_request(url, 'POST', JSON.stringify(json_data));
        if(responce.code >= 200 && responce.code < 300){
            set_message(responce.body);
            document.location.reload();
        }
        else{
            display_message(responce.body);
        }
    });
}

function ambient_data_has_changes(_new){
    if(selected_ambient_data.nombre !== _new.nombre || selected_ambient_data.tipo !== _new.tipo){
        return true;
    }
    if(selected_ambient_data.capacidad !== parseInt( _new.capacidad) || selected_ambient_data.ubicacion !== _new.ubicacion.trim()){
        return true;
    }
    if( ! selected_ambient_data.descripcion && _new.descripcion.trim() || selected_ambient_data.descripcion &&  ! _new.descripcion.trim() ||
        selected_ambient_data.descripcion && _new.descripcion.trim() && selected_ambient_data.descripcion !== _new.descripcion){
        return true;
    }
    if(! selected_ambient_data.facilidades && _new.facilidades || selected_ambient_data.facilidades && ! _new.facilidades){
        return true;
    }
    if( selected_ambient_data.facilidades && _new.facilidades){
        let e_fds = selected_ambient_data.facilidades.split(',');
        let n_fds = Array.isArray(_new.facilidades) ? _new.facilidades : [_new.facilidades];
        if(e_fds.length !== n_fds.length){
            return true;
        }
        else{
            const a1 = e_fds.sort();
            const a2 = n_fds.sort();
            for(var i = 0; i < a1.length; i++){
                if(a1.at(i) !== a2.at(i)){
                    return true;
                }
            }
        }
    }
    return false;
}

async function admin_edit_ambient(name){
    const url = '/api/ambientes/' + name;
    selected_ambient_data = (await api_request(url, 'GET')).body[0];
    set_admin_form_values('Editar Ambiente',  url, 'POST', selected_ambient_data, 'Guardar');
    const form = document.querySelector('#add-edit-ambient-modal form');
    form.addEventListener('submit', async ev =>{
        ev.preventDefault();
        const json_data = get_json_data_from_form(form);
        const is_changed = ambient_data_has_changes(json_data);
        if( is_changed ){
            const responce = await api_request(url, 'PUT', JSON.stringify(json_data) );
            if(responce.code >= 200 && responce.code < 300){
                set_message(responce.body);
                document.location.reload();
            }
            else{
                display_message(responce.body);
            }
        }
        else{
            display_message("No changes have been made.");
        }
    });
}

async function admin_del_ambient(name){
    const url = '/api/ambientes/' + name;
    const modal = document.getElementById('delete-ambient-modal');
    const form = modal.querySelector('form');
    const new_form = form.cloneNode(true);
    modal.querySelector('.nombre-ambiente').innerText = name;
    new_form.querySelector('input[name="nombre"]').value = name;
    form.parentNode.replaceChild(new_form, form);
    new_form.addEventListener('submit', async ev =>{
        ev.preventDefault();
        const json_data = get_json_data_from_form(new_form);
        const responce = await api_request(url, 'DELETE', JSON.stringify(json_data) );
        if(responce.code >= 200 && responce.code < 300){
            set_message(responce.body);
            document.location.reload();
        }
        else{
            display_message(responce.body);
        }        
    });
}

function set_admin_form_values(title, url, method, values, submit_name){
    const modal = document.getElementById('add-edit-ambient-modal');
    const form = modal.querySelector('form');
    const new_form = form.cloneNode(true);

    const nom = new_form.querySelector('input[name="nombre"]');
    const tipo = new_form.querySelector('select[name="tipo"]');
    const ubic = new_form.querySelector('input[name="ubicacion"]');
    const cap = new_form.querySelector('input[name="capacidad"]');
    const desc =  new_form.querySelector('textarea[name="descripcion"]');
    const facilidades = values.facilidades ? values.facilidades.split(',') : [];
    const checkboxs = new_form.querySelectorAll('input[type="checkbox"]');

    modal.querySelector('h3').innerText = title;
    new_form.action = url;
    new_form.method = method;
    new_form.querySelector('input[type="submit"]').value = submit_name;

    nom.value = values.nombre ? values.nombre : "";
    tipo.value = values.tipo ? values.tipo : "";
    ubic.value = values.ubicacion ? values.ubicacion : "";
    cap.value = values.capacidad ? values.capacidad : "";
    desc.value = values.descripcion ? values.descripcion : "";
    checkboxs.forEach(cb => {
        cb.checked = false;
    });
    facilidades.forEach(f =>{
        const checkbox = new_form.querySelector('input[value="' + f + '"]');
        checkbox.checked = true;
    });

    form.parentNode.replaceChild(new_form, form);
    set_admin_form_validations();
}

function valid_text_input(text){
    return /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(text);
}

function valid_number_range(number, min, max){
    return number >= min && number <= max;
}

function validate_ambient_name(input){
    const state = input.validity;
    if( state.valueMissing ){
        input.setCustomValidity("Ingresa un nombre para el ambiente.");
    }
    else if( state.patternMismatch ){
        input.setCustomValidity("Caracter invalido");
    }
    else{
        input.setCustomValidity("");
    }
    
    input.reportValidity();
}

function validate_ambient_capacity(input){
    const state = input.validity;
    if( state.valueMissing ){
        input.setCustomValidity("Ingresa un numero para el ambiente.");
    }
    else if( ! valid_number_range(input.value, 1, 500) ){
        input.setCustomValidity("El número debe estar entre 1 y 500");
    }
    else{
        input.setCustomValidity("");
    }
    
    input.reportValidity();
}

function set_admin_form_validations(){
    const form = document.querySelector('#add-edit-ambient-modal form');
    const name = form.querySelector('input[name="nombre"]');
    name.addEventListener('input', () =>{
        name.setCustomValidity("");
        validate_ambient_name(name);
    });
    const cap = form.querySelector('input[name="capacidad"]');
    cap.addEventListener('input', () =>{
        cap.setCustomValidity("");
        validate_ambient_capacity(cap);
    });
}