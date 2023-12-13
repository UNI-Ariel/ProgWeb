function json_object(string){
    try{
        const res = JSON.parse(string);
        return res;
    }
    catch(err){
        console.error(err.message);
        console.error('On string:', string);
    }
    return {};
}

async function api_request(url, method, send_data){
    try{
        const data = {headers: {'Content-Type': 'application/json'}};
        data.method = method;
        if(send_data){
            data.body = send_data;
        }
        const res = await fetch(url, data);
        const string = await res.text();
        return json_object(string);
    }
    catch(err){
        console.error(err.message);
        console.error(err.stack);
    }
    return {};
}

async function get_info_ambiente(){
    const info = await api_request('api/info', 'GET');
    return info.propiedades;
}