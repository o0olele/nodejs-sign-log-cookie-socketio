String.prototype.getBytesLength = function () {
    return this.replace(/[^\x00-\xff]/gi, "---").length;
}

function isnull(val) {
    var str = val.toString().replace(/(^\s*)|(\s*$)/g, ''); //去除空格;

    if (str == '' || str == undefined || str == null || val == null || val == undefined) {
        return true;
    } else {
        return false;
    }
}

//user's messages
function add_right_message_box(aim, value) {
    var div_row = document.createElement('div');
    div_row.setAttribute('class', 'row');
    aim.appendChild(div_row);

    var div_col = document.createElement('div');
    div_col.setAttribute('class', 'col-sm-8 col-md-8');
    div_col.setAttribute('style', 'float: right');
    div_row.appendChild(div_col);

    var div_thum = document.createElement('div');
    div_thum.setAttribute('class', 'thumbnail');
    div_thum.setAttribute('style', 'float:right;background: rgba(0, 0, 0, 0.0);border: none;width:fit-content;width:-webkit-fit-content;width:-moz-fit-content;');
    div_col.appendChild(div_thum);

    var img_head = document.createElement('img');
    img_head.setAttribute('class', 'img-circle');
    img_head.setAttribute('style', 'float: right;width:40px;height:40px')
    img_head.src = "images/head.jpg";
    div_thum.appendChild(img_head);

    var div_pan = document.createElement('div');
    div_pan.setAttribute('class', 'panel panel-default');
    div_pan.setAttribute('style', 'margin-right: 40px;margin-top: 30px');
    div_thum.appendChild(div_pan);

    var div_body = document.createElement('div');
    div_body.setAttribute('class', 'panel-body');
    div_body.setAttribute('style', 'word-wrap:break-word;');
    div_body.innerText = value;
    div_pan.appendChild(div_body);

}

//others messages
function add_left_message_box(aim, name, msg, date) {
    var div_row = document.createElement('div');
    div_row.setAttribute('class', 'row');
    aim.appendChild(div_row);

    var div_col = document.createElement('div');
    div_col.setAttribute('class', 'col-sm-8 col-md-8');
    div_col.setAttribute('style', 'float: left');
    div_row.appendChild(div_col);

    var div_thum = document.createElement('div');
    div_thum.setAttribute('class', 'thumbnail');
    div_thum.setAttribute('style', 'float:left;background: rgba(0, 0, 0, 0.0);border: none;width:fit-content;width:-webkit-fit-content;width:-moz-fit-content;');
    div_col.appendChild(div_thum);

    var img_head = document.createElement('img');
    img_head.setAttribute('class', 'img-circle');
    img_head.setAttribute('style', 'float: left;width:40px;height:40px');
    img_head.src = "images/head.jpg";
    div_thum.appendChild(img_head);

    var span_name = document.createElement('span');
    span_name.setAttribute('class', 'badge');
    span_name.setAttribute('style', 'float: left;margin-top: 10px');
    span_name.innerText = name + "  " + date;
    div_thum.appendChild(span_name);

    var div_pan = document.createElement('div');
    div_pan.setAttribute('class', 'panel panel-default');
    div_pan.setAttribute('style', 'margin-left: 40px;margin-top: 30px');
    div_thum.appendChild(div_pan);

    var div_body = document.createElement('div');
    div_body.setAttribute('class', 'panel-body');
    div_body.innerHTML = msg;
    div_pan.appendChild(div_body);
}

function add_member_item(value) {
    var aim = document.getElementById('member-menu');
    var li_mem = document.createElement('li');
    li_mem.setAttribute('name', 'NAME-MESSAGE');
    li_mem.setAttribute('id', value);
    aim.appendChild(li_mem);

    var h3_mem = document.createElement('h5');
    h3_mem.setAttribute('style', 'margin-left: 10px');
    h3_mem.innerText = value;
    li_mem.appendChild(h3_mem);
}

function remove_member_item(value) {
    var aim = document.getElementById('member-menu');
    var item = document.getElementById(value);
    aim.removeChild(item);
}

function Uint8ArrayToString(data, pos, fin) {
    var dataString = "";
    for (var i = pos; i < fin; i++) {
        dataString += String.fromCharCode(data[i]);
    }
    return dataString;
}

var writeUTF = function (str, isGetBytes) {
    var back = [];
    var byteSize = 0;
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            byteSize += 1;
            back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
            byteSize += 2;
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)))
        } else if ((0x800 <= code && code <= 0xd7ff) ||
            (0xe000 <= code && code <= 0xffff)) {
            byteSize += 3;
            back.push((224 | (15 & (code >> 12))));
            back.push((128 | (63 & (code >> 6))));
            back.push((128 | (63 & code)))
        }
    }
    for (i = 0; i < back.length; i++) {
        back[i] &= 0xff;
    }
    if (isGetBytes) {
        return back
    }
    if (byteSize <= 0xff) {
        return [0, byteSize].concat(back);
    } else {
        return [byteSize >> 8, byteSize & 0xff].concat(back);
    }
}

var readUTF = function (arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var UTF = '';
    for (var i = 0; i < arr.length; i++) {
        var one = arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += arr[st + i].toString(2).slice(2)
            }
            UTF += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            UTF += String.fromCharCode(arr[i]);
        }
    }
    return UTF;
}

function increment(value) {
    $("#prog").css("width", value + "%").text(value + "%");
    if (value >= 0 && value <= 30) {
        $("#prog").addClass("progress-bar-danger");
    } else if (value >= 30 && value <= 60) {
        $("#prog").removeClass("progress-bar-danger");
        $("#prog").addClass("progress-bar-warning");
    } else if (value >= 60 && value <= 90) {
        $("#prog").removeClass("progress-bar-warning");
        $("#prog").addClass("progress-bar-info");
    } else if (value >= 90 && value < 100) {
        $("#prog").removeClass("progress-bar-info");
        $("#prog").addClass("progress-bar-success");
    } else {
        return;
    }
}

function add_left_file_message_box(aim, u_name, f_name) {
    var div_row = document.createElement('div');
    div_row.setAttribute('class', 'row');
    aim.appendChild(div_row);

    var div_col = document.createElement('div');
    div_col.setAttribute('class', 'col-sm-8 col-md-8');
    div_col.setAttribute('style', 'float: left');
    div_row.appendChild(div_col);

    var div_thum = document.createElement('div');
    div_thum.setAttribute('class', 'thumbnail');
    div_thum.setAttribute('style', 'background: rgba(0, 0, 0, 0.0);border: none');
    div_col.appendChild(div_thum);

    var img_head = document.createElement('img');
    img_head.setAttribute('class', 'img-circle');
    img_head.setAttribute('style', 'float: left;width:40px;height:40px');
    img_head.src = "img/head.jpg";
    div_thum.appendChild(img_head);

    var span_name = document.createElement('span');
    span_name.setAttribute('class', 'badge');
    span_name.setAttribute('style', 'float: left;margin-top: 10px');
    span_name.innerText = u_name;
    div_thum.appendChild(span_name);

    var div_pan = document.createElement('div');
    div_pan.setAttribute('class', 'panel panel-default');
    div_pan.setAttribute('style', 'margin-left: 40px;margin-top: 30px');
    div_thum.appendChild(div_pan);

    var div_body = document.createElement('div');
    div_body.setAttribute('class', 'panel-body');
    div_body.innerText = f_name;
    div_pan.appendChild(div_body);

    var div_foot = document.createElement('div');
    div_foot.setAttribute('class', 'panel-footer');
    div_foot.setAttribute('style', 'height: 40px')
    div_pan.appendChild(div_foot);

    var btn_down = document.createElement('button');
    btn_down.setAttribute('class', 'btn btn-primary btn-xs');
    btn_down.setAttribute('style', 'float: right');
    btn_down.setAttribute('data-toggle', 'modal');
    btn_down.setAttribute('data-target', '#DownFileModal');
    btn_down.innerText = "Download";
    div_foot.appendChild(btn_down);

    var option_select_file = document.getElementById('ID-SELECT-FILE');
    var new_option_file = document.createElement('option');
    new_option_file.innerText = u_name + '/' + f_name;
    option_select_file.appendChild(new_option_file);

}

//user's image
function add_right_img_message_box(aim, src_img) {
    var div_row = document.createElement('div');
    div_row.setAttribute('class', 'row');
    aim.appendChild(div_row);

    var div_col = document.createElement('div');
    div_col.setAttribute('class', 'col-sm-8 col-md-8');
    div_col.setAttribute('style', 'float: right');
    div_row.appendChild(div_col);

    var div_thum = document.createElement('div');
    div_thum.setAttribute('class', 'thumbnail');
    div_thum.setAttribute('style', 'background: rgba(0, 0, 0, 0.0);border: none');
    div_col.appendChild(div_thum);

    var img_head = document.createElement('img');
    img_head.setAttribute('class', 'img-circle');
    img_head.setAttribute('style', 'float: right;width:40px;height:40px')
    img_head.src = "img/head.jpg";
    div_thum.appendChild(img_head);

    var div_pan = document.createElement('div');
    div_pan.setAttribute('class', 'panel panel-default');
    div_pan.setAttribute('style', 'margin-right: 40px;margin-top: 30px');
    div_thum.appendChild(div_pan);

    var div_body = document.createElement('div');
    div_body.setAttribute('class', 'panel-body');
    div_pan.appendChild(div_body);

    var img_body = document.createElement('img');
    img_body.setAttribute('class', 'img-responsive');
    img_body.src = src_img;
    div_body.appendChild(img_body);
}

//others image
function add_left_img_message_box(aim, value, src_img) {
    var div_row = document.createElement('div');
    div_row.setAttribute('class', 'row');
    aim.appendChild(div_row);

    var div_col = document.createElement('div');
    div_col.setAttribute('class', 'col-sm-8 col-md-8');
    div_col.setAttribute('style', 'float: left');
    div_row.appendChild(div_col);

    var div_thum = document.createElement('div');
    div_thum.setAttribute('class', 'thumbnail');
    div_thum.setAttribute('style', 'background: rgba(0, 0, 0, 0.0);border: none');
    div_col.appendChild(div_thum);

    var img_head = document.createElement('img');
    img_head.setAttribute('class', 'img-circle');
    img_head.setAttribute('style', 'float: left;width:40px;height:40px');
    img_head.src = "img/head.jpg";
    div_thum.appendChild(img_head);

    var span_name = document.createElement('span');
    span_name.setAttribute('class', 'badge');
    span_name.setAttribute('style', 'float: left;margin-top: 10px');
    span_name.innerText = value.substr(1, value.length);
    div_thum.appendChild(span_name);

    var div_pan = document.createElement('div');
    div_pan.setAttribute('class', 'panel panel-default');
    div_pan.setAttribute('style', 'margin-left: 40px;margin-top: 30px');
    div_thum.appendChild(div_pan);

    var div_body = document.createElement('div');
    div_body.setAttribute('class', 'panel-body');
    div_pan.appendChild(div_body);

    var img_body = document.createElement('img');
    img_body.setAttribute('class', 'img-responsive');
    img_body.src = src_img;
    div_body.appendChild(img_body);
}


function add_history_message_box(aim, fromname, toname, time, value) {
    var div_row = document.createElement('div');
    div_row.setAttribute('class', 'row');
    aim.appendChild(div_row);

    var div_col = document.createElement('div');
    div_col.setAttribute('class', 'col-sm-8 col-md-8');
    div_col.setAttribute('style', 'float: left');
    div_row.appendChild(div_col);

    var div_pan = document.createElement('div');
    div_pan.setAttribute('class', 'panel panel-default');
    div_col.appendChild(div_pan);

    var div_body = document.createElement('div');
    div_body.setAttribute('class', 'panel-body');
    div_pan.appendChild(div_body);

    var tab = "<table class=\"table\"><tr><td>From</td><td>To</td><td>Time</td></tr><tr><td>" + fromname + "</td><td>" + toname + "</td><td>" + time + "</td></tr></table>" + value;

    div_body.innerHTML = tab;
}

