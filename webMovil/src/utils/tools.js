function alphabetical(string){
    return /^[a-zA-Z]+$/.test(string);
}

function numeric(string){
    return /^\d+$/.test(string);
}

function alpha_numeric(string){
    return /^[0-9a-zA-Z]+$/.test(string);
}

function valid_text(string){
    return /^[0-9a-zA-Z]+(?:\s[0-9a-zA-Z]+)?$/.test(string);
}

function get_filters(query){
    const filters = {};
    if('page' in query){
        const page = query.page;
        if(numeric(page) && page > 0){
            filters.page = page;
        }
    }
    if('perPage' in query){
        const perPage = query.perPage;
        if(numeric(perPage) && perPage > 0){
            filters.perPage = perPage;
        }
    }
    return filters;
}

function valid_date(date){
    const format = /^\d{4}-\d{2}-\d{2}$/;
    if(! format.test(date)){
        return false;
    }
    const values = date.split('-');
    const js_date = new Date(values[0], values[1], values[2]);
    const aa = parseInt(values[0]);
    const mm = parseInt(values[1]);
    const dd = parseInt(values[2]);
    return js_date.getFullYear() === aa && js_date.getMonth() === mm && js_date.getDate() === dd;
}

module.exports ={
    alphabetical,
    numeric,
    alpha_numeric,
    valid_text,
    valid_date,
    get_filters
}