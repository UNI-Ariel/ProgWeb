const validOptions = {
    ap: 'app_port', 
    dp: 'db_port'
};

function validateLength(args){
    const length = args.length;

    if(length > 6 || length % 2 !== 0){
        console.log('Error: Numero de argumentos incorrecto. (' + length +' )');
        return 0;
    }
    return 1;
}

function validateOptions(args){
    const revised = [];
    for(i = 2; i < args.length; i+=2){
        const opt = args[i];
        const val = args[i+1];
        if(!(opt in validOptions)){
            console.log('Error: La Opcion "' + opt +'" no es valida.');
            return 0;
        }
        if(revised.includes(opt)){
            console.log('Error: La Opcion "' + opt +'" se esta repitiendo.');
            return 0;
        }
        if(!/^\d+$/.test(val)){
            console.log('Error: El puerto (' + val + ') para la  opcion "' + opt + '" no es valido');
            return 0;
        }
        const port = parseInt(val);
        if(port < 1024 || port > 65535){
            console.log('Error: El valor para el puerto debe estar en el rango 1024 - 65535');
            return 0;
        }
        revised.push(opt);
    }
    return 1;
}

function getArguments(args){
    const parameters = {};
    if(validateLength(args) && validateOptions(args)){
        for(i = 2; i < args.length; i+=2){
            const opt = args[i];
            const val = parseInt(args[i+1]);
            parameters[validOptions[opt]] = val;
        }
    }
    else{
        console.log('Error en los argumentos. Se usara valores por defecto');
    }
    return parameters;
}

module.exports = {
    getArguments
};