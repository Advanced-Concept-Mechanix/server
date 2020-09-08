export default function convertToString(value){
    let str = '';
    for(let i = 0; i < value.length; i++){
        str += value[i];
    }
    return str;
}