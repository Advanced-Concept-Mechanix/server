// include node fs module
var fs = require('fs');

function delFile(filename){
    fs.unlink(filename, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
        return true;
    }); 
}

module.exports = delFile;