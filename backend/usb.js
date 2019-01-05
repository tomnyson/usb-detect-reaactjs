var usbDetect = require('usb-detection');
const drivelist = require('drivelist');
const fs = require('fs');
let  checkUsb = () => {
    usbDetect.startMonitoring();

    // Detect add/insert
    usbDetect.on('add', function (device) { console.log('add', device); });

    // Detect remove
    usbDetect.on('remove', function (device) { console.log('remove', device); });

    // Detect add or remove (change)
    usbDetect.on('change', function (device) { console.log('change', device); });

    // Get a list of USB devices on your system, optionally filtered by `vid` or `pid`
    usbDetect.find(function (err, devices) { console.log('find', devices, err); });
    // Promise version of `find`:
    usbDetect.find().then(function (devices) { console.log(devices); }).catch(function (err) { console.log(err); });

// Allow the process to exit
//usbDetect.stopMonitoring()
}
const helloworld = () => {
    console.log('xin chao ban')
}
let getAll = () => {
    var promise = new Promise((resolve, reject) => {
        drivelist.list((error, drives) => {
            if (error) {
                throw error;
            }
    
            console.log('drives',JSON.stringify(drives));
            resolve(drives)
      });
    });
    return promise;
}
let writeFile = (data) => {
        var promise = new Promise((resolve, reject) => {
            fs.writeFile(data.path+'/backup.txt', data.content, function(err) {
                if(err) {
                    console.log(err)
                }
            
                resolve(true)
            });   
        })
    return promise
}
module.exports = {
    checkUsb: checkUsb,
    helloworld: helloworld,
    getAll: getAll,
    writeFile: writeFile
}