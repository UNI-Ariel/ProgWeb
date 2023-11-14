const validOptions = ['ap', 'dp'];

function validateLength(args){
    const length = args.length;

    if(length > 6 || length % 2 !== 0){
        console.log('Numero de argumentos incorrecto. (' + length +' )');
        return 0;
    }
    return 1;
}

function validateOptions(args){
    const revised = [];
    for(i = 2; i < args.length; i+=2){
        const opt = args[i];
        const val = args[i+1];
        if(!validOptions.includes(opt)){
            console.log('La Opcion "' + opt +'" no es valida.');
            return 0;
        }
        if(revised.includes(opt)){
            console.log('La Opcion "' + opt +'" se esta repitiendo.');
            return 0;
        }
        if(!/^\d+$/.test(val)){
            console.log('El puerto ' + val + ' para la  opcion "' + opt + '" no es valido');
            return 0;
        }
        revised.push(opt);
    }
    return 1;
}

function validateValues(args){
    for(i = 3; i < args.length; i+=2){
        const port = parseInt(args[i]);
        if(port < 1024 || port > 65535){
            console.log('El puerto debe estar en el rango 1024 - 65535');
            return 0;
        }
    }
    return 1;
}

function parse(args){
    const parameters = {};
    if(validateLength(args) && validateOptions(args) && validateValues(args)){
        for(i = 2; i < args.length; i+=2){
            const opt = args[i];
            const val = parseInt(args[i+1]);
            if(opt === 'ap'){
                parameters.app_port = val;
            }
            if(opt === 'dp'){
                parameters.db_port = val;
            }
        }
    }
    else{
        console.log('Fallo en los argumentos. Se usara valores por defecto');
    }
    return parameters;
}

module.exports = parse;