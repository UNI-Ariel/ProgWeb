class Tools{
    is_alphabetical(string){
        return /^[a-zA-Z]+$/.test(string);
    }

    is_numeric(string){
        return /^\d+$/.test(string);
    }

    is_alpha_numeric(string){
        return /^[0-9a-zA-Z]+$/.test(string);
    }

    is_strict_text(string){
        return /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(string);
    }

    is_date(date){
        const format = /^\d{4}-\d{2}-\d{2}$/;
        if(! format.test(date)){
            return false;
        }
        const values = date.split('-');
        const aa = parseInt(values[0]);
        const mm = parseInt(values[1]) - 1;
        const dd = parseInt(values[2]);
        const js_date = new Date(aa, mm, dd);
        return js_date.getFullYear() === aa && js_date.getMonth() === mm && js_date.getDate() === dd;
    }

    in_range(number, min, max){
        if(number < min || number > max){
            return false;
        }
        return true;
    }
}

module.exports = new Tools();