process.on('message', (msg) => {
    /*var net = require('net');
    var port = 20401;
    var host = '134.175.139.84';
    var client = new net.Socket();

    client.setEncoding('binary');

    client.connect(port, host, function () {

        //data to server immediately after connect successfully
    });*/

    if (msg.indexOf("%name") != -1 || msg.indexOf("%pass") != -1) {
        str = msg.split(":");
        const buf = Buffer.alloc(32);
        buf.write("11", 0, 'hex');
        buf.write("00", 1, 'hex');
        buf.write("2000", 2, 'hex');
        buf.write(str[1], 4);

        client.write(buf);
    }
    console.log('子进程收到消息', msg);

    /*const bufback = Buffer.alloc(4);
    client.on('data', function (data) {
        bufback.write(data);
        if (bufback.readInt8(2) == 1)
            alert("identify success!");
        else {
            alert("connect refused!");
            //client.destory();
        }
        //data from server
    });
    client.on('error', function (error) {
        //error and close
        alert(error);
        client.destory();
    });

    /*client.on('close', function () {
        //close 
        alert("connetion closed!");
    });*/

});