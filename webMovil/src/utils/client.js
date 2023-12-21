const tools = require('./tools');
const ambiente = require('../db/ambiente');

class Client{    
    is_ambient_valid_data(data){
        //Verify existence of required keys
        if(! ('nombre' in data) || ! ('tipo' in data) || ! ('ubicacion' in data) || ! ('descripcion' in data) || ! ('capacidad' in data) ){
            return false;
        }
        //Verify strict name, ubicacion not empty and numeric capacidad
        if( ! tools.is_strict_text(data.nombre) || ! data.ubicacion.trim().length || ! tools.is_numeric(data.capacidad)){
            return false;
        }

        if(data.nombre.length > 64 || data.ubicacion.length > 200 || ! tools.in_range(data.capacidad, 1, 500)){
            return false;
        }        

        if(data.descripcion && data.descripcion.length > 200){
            return false;
        }

        //Verify existence of an actual type for ambient
        const tipos = ambiente.get_tipos();
        if( ! (data.tipo in tipos) ){
            return false;
        }
        //If facilities exists verify they are valid
        if( 'facilidades' in data){
            if( data.facilidades === ""){
                return false;
            }
            if( Array.isArray(data.facilidades) && ! data.facilidades.length){
                return false;
            }
            const facilidades = ambiente.get_facilidades();
            let values = data.facilidades;
            if( ! Array.isArray(values) ){
                values = [values];
            }
            for(const v of values){
                if (! (v in facilidades) ){
                    return false;
                }
            }
        }
        return true;
    }

    is_put_updated_data(curr, upt){
        if(curr.nombre !== upt.nombre || curr.tipo !== upt.tipo){
            return true;
        }
        if(curr.capacidad !== parseInt( upt.capacidad) || curr.ubicacion !== upt.ubicacion.trim()){
            return true;
        }
        if( ! curr.descripcion && upt.descripcion.trim() || curr.descripcion &&  ! upt.descripcion.trim() ||
            curr.descripcion && upt.descripcion.trim() && curr.descripcion !== upt.descripcion){
            return true;
        }
        if(! curr.facilidades && upt.facilidades || curr.facilidades && ! upt.facilidades){
            return true;
        }
        if( curr.facilidades && upt.facilidades){
            let e_fds = curr.facilidades.split(',');
            let n_fds = Array.isArray(upt.facilidades) ? upt.facilidades : [upt.facilidades];            
            if(e_fds.length !== n_fds.length){
                return true;
            }
            else{
                const a1 = e_fds.sort();
                const a2 = n_fds.sort();
                console.log(a1, a2);
                for(var i = 0; i < a1.length; i++){
                    if(a1.at(i) !== a2.at(i)){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    is_search_available_valid_query(query){
        if(! ('fecha' in query) || ! ('horario' in query) || ! ('capacidad' in query)){
            return false;
        }
        if( ! tools.is_date(query.fecha) || ! tools.is_numeric(query.horario) || ! tools.is_numeric(query.capacidad)){
            return false;
        }
        const periodos = ambiente.get_periodos();
        if( ! (query.horario in periodos) ){
            return false;
        }
        return true;
    }

    check_filters(query){
        if('page' in query && ! tools.is_numeric(query.page) ){
            return false;
        }
        if('perPage' in query && ! tools.is_numeric(query.perPage)){
            return false;
        }
        if('capacidad' in query && ! tools.is_numeric(query.capacidad)){
            return false;
        }
        const tipos = ambiente.get_tipos();
        if('tipo' in query && ! (query.tipo in tipos) ){
            return false;
        }
        const facilidades = ambiente.get_facilidades();
        if('facilidades' in query){
            let fds = query.facilidades;
            if( ! Array.isArray(fds)){
                fds = [fds];
            }
            for(const f of fds){
                if (! (f in facilidades) ){
                    return false;
                }
            }
        }
        if('fecha' in query && ! tools.is_date(query.fecha)){
            return false;
        }
        return true;
    }

    check_booking_filters(query){
        if(! ('fecha' in query) || ! ('horario' in query) ){
            return false;
        }
        if( ! tools.is_numeric(query.horario) ){
            return false;
        }
        const periodos = ambiente.get_periodos();
        if( ! (query.horario in periodos) ){
            return false;
        }
        return this.check_filters(query);
    }

    check_booking_valid_action(query){
        if(! ('action' in query) ){
            return false;
        }
        if( ! tools.is_alphabetical(query.action)){
            return false;
        }
        const ok_values = ["accept", "reject"];
        if( ! ok_values.includes(query.action)){
            return false;
        }
        return true;
    }
}

module.exports = new Client();