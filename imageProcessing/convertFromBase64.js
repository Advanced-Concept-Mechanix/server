function decode_base64WithoutBuffer(str, name){
    let base64Image = str.split(';base64,').pop();

    fs.writeFile(`${name}`, base64Image, {encoding: 'base64'}, function(err) {
        console.log('File created');
    });
}

module.exports = decode_base64WithoutBuffer;