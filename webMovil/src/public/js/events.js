function set_menu_button_events(){
    const menu_buttons = document.querySelectorAll('.nav-button');
    menu_buttons.forEach(button =>{
        button.addEventListener('click', (ev) =>{
            open_menu(button);
        });
    });
}

function set_search_available_event(){
    const search_form = document.getElementById('search-form');
    search_form.addEventListener('submit', (ev) =>{
        ev.preventDefault();
        search_available_ambiente(ev.target);
    });
}

function set_admin_modal_event(){
    //Show modal events
    const admin_edit_buttons = document.querySelectorAll('.admin-button');
    admin_edit_buttons.forEach(button =>{
        button.addEventListener('click', ev =>{
            ev.stopPropagation();
            admin_ambient(button);
        });
    });
}

function set_booking_search_event(){
    const form = document.getElementById('booking-form');
    form.addEventListener('submit', async ev =>{
        ev.preventDefault();
        search_ambient_booking(ev.target);
    });
    const back_btn = document.getElementById('booking-results').querySelector('.page-button');
    back_btn.addEventListener('click', ev =>{
        ev.stopPropagation();
        document.getElementById('booking-results').classList.add('hide');
        document.getElementById('booking-search').classList.remove('hide');
    });
}

function set_booking_modal_event(){
    const form = document.getElementById('confirm-booking-modal').querySelector('form');
    form.addEventListener('submit', async ev =>{
        ev.preventDefault();
        handle_booking_submision(ev.target);
    });
}

function set_admin_booking_btn_event(){
    const buttons = document.querySelectorAll('.admin-button');
    buttons.forEach(btn =>{
        btn.addEventListener('click', ev =>{
            ev.stopPropagation();
            handle_booking_admin_action(btn);
        });
    });
}

function set_admin_booking_modal_event(){
    const form = document.getElementById('booking-action-modal').querySelector('form');
    form.addEventListener('submit', async ev =>{
        ev.preventDefault();
        handle_booking_action_form_submit(ev.target);
    });
}

function set_modal_event(){
     //Modal buttons
     const modal_buttons = document.querySelectorAll('.custom-modal .modal-action-button');
     modal_buttons.forEach(btn =>{
         btn.addEventListener('click', ev =>{
             ev.stopPropagation();
             custom_modal_btn_action(btn);
         });
     });
}

function set_login_events(){
    const btn = document.getElementById('reveal-pass-btn');
    btn.addEventListener('click', ev =>{
        ev.preventDefault();
        ev.stopPropagation();
        const input = ev.target.previousElementSibling;
        if(ev.target.classList.contains('revealed')){
            ev.target.classList.remove('revealed');
            input.type = "password";
        }
        else{
            ev.target.classList.add('revealed');
            input.type = "text";
        }
    });
}

window.addEventListener('load', async () =>{
    set_time();
    set_menu_button_events();
    set_modal_event();
    check_message();
});