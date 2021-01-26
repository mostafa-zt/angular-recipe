const fs = require('fs');
const removeFile = (filePath) => {
    // const _filePath = filePath.replace('\\', '');
    const fileExist = fs.existsSync(filePath);
    // fs.access(filePath , )
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.unlinkSync(filePath, (err) => {
                if (err) {
                    throw new Error(err);
                }
            });
        }
    });
}

module.exports = {removeFile }