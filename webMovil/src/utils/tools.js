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

module.exports ={
    alphabetical,
    numeric,
    alpha_numeric,
    valid_text,
    get_filters
}