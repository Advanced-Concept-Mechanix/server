var fs = require('fs');

function encode_base64(filename){
    fs.readFile(filename,function(error,data){
      if(error){
        throw error;
      }else{
        var buf = Buffer.from(data);
        var base64 = buf.toString('base64');
        console.log(`Base64 of ${filename} :` + base64);
        return base64;
      }
    });
}

module.exports = encode_base64;