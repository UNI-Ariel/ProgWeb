const tools = require('./tools');
const ambiente = require('../db/ambiente');

class Client{    
    is_ambient_valid_data(data){
        //Verify existence of required keys
        if(! 'nombre' in data || ! 'tipo' in data || ! 'ubicacion' in data || ! 'descripcion' in data || ! 'capacidad' in data){
            return false;
        }
        //Verify strict name, ubicacion not empty and numeric capacidad
        if( ! tools.is_strict_text(data.nombre) || ! data.ubicacion.trim().length || ! tools.is_numeric(data.capacidad)){
            return false;
        }
        //Verify existence of an actual type for ambient
        const tipos = ambiente.get_tipos();
        if( ! data.tipo in tipos){
            return false;
        }
        //If facilities exists verify they are valid
        if( 'facilidades' in data){
            const facilidades = ambiente.get_facilidades();
            let values = data.facilidades;
            if( ! Array.isArray(values) ){
                values = [values];
            }
            values.forEach(v =>{
                if( ! v in facilidades){
                    return false;
                }
            });
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
        }
        return false;
    }

    is_search_available_valid_query(query){
        if(! 'fecha' in query || ! 'horario' in query || ! 'capacidad' in query){
            return false;
        }
        if( ! tools.is_date(query.fecha) || ! tools.is_numeric(query.horario) || ! tools.is_numeric(query.capacidad)){
            return false;
        }
        const periodos = ambiente.get_periodos();
        if( ! query.horario in periodos ){
            return false;
        }
        return true;
    }
}

module.exports = new Client();