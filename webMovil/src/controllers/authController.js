const ambiente = require('../db/ambiente');
const client = require('../utils/client');
const tools = require('../utils/tools');

async function api_logout(req, res){
    const api_res = {};
    if(req.session.logged){
        req.session.destroy();
        api_res.code = 200;
        api_res.body = "Sesion closed.";
    }
    else{
        api_res.code = 200;
        api_res.body = "Sesion was not open.";
    }
    res.status(api_res.code).json(api_res);
}

async function api_get_ambientes(req, res){
    const api_res = {};
    if( ! client.check_filters(req.query) ){
        api_res.code = 400;
        api_res.body = "Invalid query for the request.";
    }
    else{
        const data = await ambiente.get_all(req.query);
        if(data.length){
            api_res.code = 200;
            api_res.body = data;
        }
        else{
            api_res.code = 404;
            api_res.body = "The requested resource was not found";
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_get_ambiente(req,res){
    const api_res = {};
    const name = req.params.name;
    if( ! tools.is_strict_text(name)){
        api_res.code = 400;
        api_res.body = "Invalid name for the request.";
    }
    else{
        const data = await ambiente.find(name);
        if(data.length){
            api_res.code = 200;
            delete data["id"];
            api_res.body = data;
        }
        else{
            api_res.code = 404;
            api_res.body = "Ambient with name '" + name + "' does not exist.";
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_post_ambiente(req, res){
    const api_res = {};
    const data = req.body;
    if( ! client.is_ambient_valid_data(data) ){
        api_res.code = 400;
        api_res.body = "Invalid or missing parameters.";
    }    
    else{
        const exists = await ambiente.find(data.nombre);
        if(exists.length){
            api_res.code = 422;
            api_res.body = "Requested name already exists: " + data.nombre;
        }
        else{
            const result = await ambiente.add_new(data);
            if(result){
                api_res.code = 201;
                api_res.body = "A new ambiente has been added.";
            }
            else{
                api_res.code = 500;
                api_res.body = "An error occured while adding a new ambient.";
            }
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_put_ambiente(req, res){
    const api_res = {};
    const name = req.params.name;
    if( ! tools.is_strict_text(name)){
        api_res.code = 400;
        api_res.body = "The provided original ambient name for update is invalid.";
    }
    else if( ! client.is_ambient_valid_data(req.body) ){
        api_res.code = 400;
        api_res.body = "Invalid or missing parameters for update.";        
    }
    else{
        const current = await ambiente.find(name);
        if( ! current.length){
            api_res.code = 404;
            api_res.body = "The ambient you are trying to update doesn't exist.";            
        }
        else if( ! client.is_put_updated_data(current[0], req.body)){
            api_res.code = 400;
            api_res.body = "The provided data doesn't have any new changes to current ambient.";            
        }
        else{
            if(current[0].nombre !== req.body.nombre){
                const exists = await ambiente.find(req.body.nombre);
                if(exists.length){
                    api_res.code = 422;
                    api_res.body = "The name already exists: " + req.body.nombre;
                    res.status(api_res.code).json(api_res);
                    return;
                }                    
            }            
            const result = await ambiente.update(current[0], req.body);
            if(result){
                api_res.code = 200;
                api_res.body = "The  ambient has been updated.";
            }
            else{
                api_res.code = 500;
                api_res.body = "An error occured while uptading the ambient.";
            }
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_delete_ambiente(req, res){
    const api_res = {};
    const name = req.params.name;
    if( ! tools.is_strict_text(name)){
        api_res.code = 400;
        api_res.body = "The provided ambient name is invalid.";
    }
    else{
        const ambient = await ambiente.find(name);
        if( ! ambient.length){
            api_res.code = 404;
            api_res.body = "The ambient you are trying to disable doesn't exist.";            
        }
        else{
            const result = await ambiente.delete(ambient[0].id);
            if(result){
                api_res.code = 200;
                api_res.body = "The  ambient has been disabled.";
            }
            else{
                api_res.code = 500;
                api_res.body = "An error occured while disabling the ambient.";
            }
        }  
    }
    res.status(api_res.code).json(api_res);
}

async function api_get_bookables(req, res){
    const api_res = {};
    const filters = req.query;
    if( ! client.check_booking_filters(filters) ){
        api_res.code = 400;
        api_res.body = "Invalid request parameters.";
    }
    else{
        const result = await ambiente.get_bookables(filters);
        if(result.length){
            api_res.code = 200;
            api_res.body = result;
        }
        else{
            api_res.code = 404;
            api_res.body = "No ambients found.";
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_add_booking(req, res){
    const api_res = {};
    const name = req.params.name;
    const filters = req.body;
    if(! tools.is_strict_text(name)){
        api_res.code = 400;
        api_res.body = "Invalid ambient name.";
    }
    else if( ! client.check_booking_filters(filters) ){
        api_res.code = 400;
        api_res.body = "Invalid request parameters.";
    }
    else{
        const ambient = await ambiente.find(name);
        if(! ambient.length){
            api_res.code = 404;
            api_res.body = "The ambient doesn't exist.";
        }
        else{
            filters['uid'] = req.session.userData.id;
            const result = await ambiente.book(ambient[0], filters);
            if(result){
                api_res.code = 200;
                api_res.body = "A new booking request has been added";
            }
            else{
                api_res.code = 409;
                api_res.body = "The booking request can't be proccesed due to an existing conflict with another one.";
            }
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_booking_history(req, res){
    const api_res = {};
    const filters = req.query;
    if( ! client.check_filters(filters) ){
        api_res.code = 400;
        api_res.body = "Invalid URL parameters.";
    }
    else{
        const data = await ambiente.get_booking_history(req.session.userData.id, filters);
        if(data.length){
            api_res.code = 200;
            api_res.body = data;
        }
        else{
            api_res.code = 404;
            api_res.body = "There are no records to display";
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_get_bookings(req, res){
    const api_res = {};
    const filters = req.query;
    if( ! client.check_filters(filters) ){
        api_res.code = 400;
        api_res.body = "Invalid URL parameters.";
    }
    else{
        const data = await ambiente.get_pending_bookings(filters);
        if(data.length){
            api_res.code = 200;
            api_res.body = data;
        }
        else{
            api_res.code = 404;
            api_res.body = "There are no bookings records to display";
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_get_booking(req, res){
    const api_res = {};
    const booking = req.params.booking;
    if( ! tools.is_numeric(booking) ){
        api_res.code = 400;
        api_res.body = "Invalid booking.";
    }
    else{
        const reserva = await ambiente.get_booking(booking);
        if(! reserva.length){
            api_res.code = 404;
            api_res.body = "Booking doesn't exist.";
        }
        else{
            api_res.code = 200;
            api_res.body = reserva;
        }
    }
    res.status(api_res.code).json(api_res);
}

async function api_update_booking(req, res){
    const api_res = {};
    const booking = req.params.booking;
    const action = req.body;
    if( ! tools.is_numeric(booking) ){
        api_res.code = 400;
        api_res.body = "Invalid booking.";
    }
    else if( ! client.check_booking_valid_action(action) ){
        api_res.code = 400;
        api_res.body = "Invalid action parameter.";
    }
    else{
        const reserva = await ambiente.get_booking(booking);
        if(! reserva.length){
            api_res.code = 404;
            api_res.body = "Booking doesn't exist.";
        }
        else{
            const estados = ambiente.get_estados();
            if(estados[reserva[0].estado] !== estados.Pendiente){
                api_res.code = 404;
                api_res.body = "The Booking state has already been set.";
            }
            else{
                const result = await ambiente.update_pending_booking(booking, action);
                if(result){
                    api_res.code = 200;
                    api_res.body = "The Booking state has been updated.";
                }
                else{
                    api_res.code = 500;
                    api_res.body = "An error occured while updating the Booking state.";
                }
            }
        }
    }    
    res.status(api_res.code).json(api_res);
}

async function api_bookings_history(req, res){
    const api_res = {};
    const filters = req.query;
    if( ! client.check_filters(filters) ){
        api_res.code = 400;
        api_res.body = "Invalid URL parameters.";
    }
    else{
        const data = await ambiente.get_bookings_history(filters);
        if(data.length){
            api_res.code = 200;
            api_res.body = data;
        }
        else{
            api_res.code = 404;
            api_res.body = "There are no records to display";
        }
    }
    res.status(api_res.code).json(api_res);
}

async function logout(req, res){
    req.session.destroy();
    res.redirect('/');
}

async function ambientes_page(req, res){
    let filters = req.query;
    if( ! client.check_filters(req.query) ){
        filters = {};
    }
    const data = await ambiente.get_all(filters);
    const page_param = {title:'Administrar Ambientes', data, logged:true};
    page_param['userData'] = req.session.userData;
    res.render('adminAmbients', page_param);
}

function booking_page(req, res){
    const page_param = {title:'Reservar Ambiente', logged:true};
    page_param['userData'] = req.session.userData;
    res.render('booking', page_param);
}

async function booking_history(req, res){
    let filters = req.query;
    if( !client.check_filters(filters) ){
        filters = {};
    }
    const data = await ambiente.get_booking_history(req.session.userData.id, filters);
    const page_param = {title:'Historial de reservas', data, logged:true};
    page_param['userData'] = req.session.userData;
    res.render('bookingHistory', page_param);
}

async function check_bookings_page(req, res){
    let filters = req.query;
    if( ! client.check_filters(req.query) ){
        filters = {};
    }
    const data = await ambiente.get_pending_bookings(filters);
    const page_param = {title:'Administrar reservas', data, logged:true};
    page_param['userData'] = req.session.userData;
    res.render('bookingsadmin', page_param);
}

async function bookings_history(req, res){
    let filters = req.query;
    if( ! client.check_filters(req.query) ){
        filters = {};
    }
    const data = await ambiente.get_bookings_history(filters);
    const page_param = {title:'Historial reservas', data, logged:true};
    page_param['userData'] = req.session.userData;
    res.render('bookingsHistory', page_param);
}

module.exports = {
    api_logout,
    api_get_ambientes,
    api_get_ambiente,
    api_post_ambiente,
    api_put_ambiente,
    api_delete_ambiente,
    api_get_bookables,
    api_add_booking,
    api_booking_history,
    api_get_booking,
    api_get_bookings,
    api_update_booking,
    api_bookings_history,
    logout,
    ambientes_page,
    booking_page,
    booking_history,
    check_bookings_page,
    bookings_history
}