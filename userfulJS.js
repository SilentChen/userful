/**
 * @dependency layui, jquery
 * @desc common js which load at base.blade
 * @create at: 20190906
 */
const DevSrvSt = 20000;
const Layer_AutoClose_Second = 20
const Layer_AutoClose_Warn   = "Operation Timeout"
const Layer_AutoLoadType     = 2
/**
 * offering an auto closed layer loading.
 * @desc self define of layer loading
 * @param second
 * @param obj property including: msg and load_type [ json object ]
 *
 * @sideffect it will create a timer and try to close the layer load nomatter it is exist or not
 */
function loadingAutoClose(second, obj) {
    var msg = Layer_AutoClose_Warn
    var loadtype = Layer_AutoLoadType
    if (!second) second = Layer_AutoClose_Second
    if (obj && typeof(obj) === "object") {
        if(obj.hasOwnProperty("msg")) {
            msg = obj.msg
        }
        if (obj.hasOwnProperty("load_type")){
            loadtype = obj.load_type
        }
    }
    var id = Math.round(Math.random() * 10)
    id = 'myLayerID_' + id
    var layer_load_index = layer.load(loadtype, {id:id})
    setTimeout(function () {
        var obj = document.getElementById(id)
        if (null !== obj){
            layer.close(layer_load_index)
            layer.msg(msg)
        }
    }, parseInt(second) * 1000)

    return layer_load_index
}

/**
 * @desc self define of layer close
 * @param index
 */
function close_layer(index) {
   if (index)
       layer.close(index)
    else
       layer.closeAll()
}

function refreshWithParams() {
    setTimeout(function () {
        loadingAutoClose(999)
        location.reload(location.href);
    }, 2000)
}
/**
 * str trun into obj
 * @param str
 * @param default_value
 * @return {*}
 */
function jsonFormat(str, default_value) {
    ret = str;
    if (typeof str === "string") {
        try {
            var obj = JSON.parse(str);
            if (typeof obj === "object" && obj) {
                ret = obj;
            }else{
                ret = default_value ? default_value : {};
            }

        } catch (e) {
            ret = default_value ? default_value : {};
        }
    }

    return ret;
}

/**
 * @desc 获取给定游戏列表的带模糊搜索的游戏选择下拉框
 * @param name
 * @param gameObj
 * @constructor
 */
function GameSelect(name, gameObj, selected) {
    var select_html = "<form class='layui-form'><div class='layui-form-item'><div class='layui-inline col-sm-12'><select name='"+name+"' class='layui-select' lay-verify='required' lay-filter='selectTemplate' lay-search><option value=''>-请选择-</option></option>"

    if (selected) {
        if((gameObj) && gameObj.length > 0) {
            for (var i = 0; i < gameObj.length; i ++) {
                if (selected == gameObj[i]["game_id"])
                    select_html += "<option selected value='"+gameObj[i]['game_id']+"'>"+gameObj[i]['game_name']+"</option>"
                else
                    select_html += "<option value='"+gameObj[i]['game_id']+"'>"+gameObj[i]['game_name']+"</option>"
            }
        }
    }else{
        if((gameObj) && gameObj.length > 0) {
            for (var i = 0; i < gameObj.length; i ++) {
                select_html += "<option value='"+gameObj[i]['game_id']+"'>"+gameObj[i]['game_name']+"</option>"
            }
        }
    }

    select_html += "</select></div></div></form>"

    return select_html;
}

//判断字符是否为空的方法
function isEmpty(string){
    if(typeof string == "undefined" || string == null || string == ""){
        return true;
    }else{
        return false;
    }
}

function jsonLength(jsonObj) {
    return Object.keys(jsonObj).length;
}

/**
 * json参数是否为空自动检测-返回去除为空的元素
 * @desc 如果必须且为空情况存在则返回失败 即state不为0
 * @param json object parameterJsonObj
 * @param array object requiredParameterArr
 * @return {{state: number, desc: string, data: {}}}, 0 succcess, other fail.
 */
function checkParams(parameterJsonObj, requiredParameterArr) {
    var ret = {state: 0, desc: 'success'}
    var key = null;
    if (typeof parameterJsonObj === "object" && jsonLength(parameterJsonObj) > 0 && typeof requiredParameterArr === "object"){
        for (key in parameterJsonObj) {
            if (isEmpty(parameterJsonObj[key])) {
                if ($.inArray(key, requiredParameterArr) >= 0) {
                    ret.state = 1;
                    ret.desc = '提醒: '+key + ' 不能为空';
                    break;
                }else{
                    delete parameterJsonObj[key];
                    continue;
                }
            }
        }
    }
    return ret;
}

/**
 * desc 统一默认打开弹窗部分设置
 * @param config
 */
function openWindow(config) {
    if (typeof config["closeBtn"]   === "undefined") config.closeBtn    = 1
    if (typeof config["maxmin"]     === "undefined") config.maxmin      = true
    if (typeof config["shadeClose"] === "undefined") config.shadeClose  = false
    if (typeof config["type"]       === "undefined") config.type        = 1

    return layer.open(config)
}

/**
 * 日期 转换为 Unix时间戳
 * @param <string> 2014-01-01 20:20:20  日期格式
 * @return <int>        unix时间戳(天)
 */
function datetounix(string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
        )).getTime() / 1000;
}

/**
 * 时间戳转换日期
 * @param <int> unixTime  待时间戳(秒)
 * @param <bool> isFull  返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
 * @param <int> timeZone  时区
 */
function unixtodate(unixTime, isFull, timeZone) {
    if (typeof (timeZone) == 'number')
    {
        unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
    }
    var time = new Date(unixTime * 1000);
    var ymdhis = "";
    ymdhis += time.getUTCFullYear() + "-";
    ymdhis += (time.getUTCMonth()+1) + "-";
    ymdhis += time.getUTCDate();
    if (isFull === true)
    {
        ymdhis += " " + time.getUTCHours() + ":";
        ymdhis += time.getUTCMinutes() + ":";
        ymdhis += time.getUTCSeconds();
    }
    return ymdhis;
}

/**
 * 异步DEFER请求工作函数
 * @param task :
 *              -params: params for call back func or ajax request type setting [post/get,json/text,timeout].
 *              -request: ajax request real params.
 *              -url:   ajax request url.
 * @returns result state [0-success, 1-fail] cb_param {}
 * @private
 */
function makeAjaxRequest (task) {
    if ('undefined' === typeof(task)) task = {};
    if ('undefined' === typeof(task.cb_params)) task.cb_params = {};
    var type        = ("undefined" === typeof(task.type))         ? 'POST'    : task.type;
    var datatype    = ("undefined" === typeof(task.dataType))     ? 'json'    : task.dataType;
    var timeout     = ("undefined" === typeof(task.timeout))      ? 0         : task.timeout;
    var defer = $.Deferred();
    $.ajax({
        type: type,
        crossDomain: true == !(document.all),
        url : task.url,
        timeout : timeout,
        datatype : datatype,
        data : task.data,
        success: function(result){
            var state = 0;
            defer.resolve(result, state, task.cb_params)
        },
        error: function(xhr, textStatus, errorThrown ){
            var state = 1;
            var readyState = ['未初始化', '正在载入', '已经载入', '数据进行交互', '完成']
            var errStr = xhr.status+" | "+readyState[xhr.readyState]+" | " +xhr.statusText + " | 响应："+xhr.responseText+" | 状态："+textStatus;
            defer.resolve(errStr, task.cb_params)
        }
    });
    return defer.promise();
}

/**
 *
 * @ajax http request maker
 * @param setting
 * @method: get or port
 * @async: default is true
 * @dataType: json or form (text/html is default)
 *          : json: data will be trun into json string from json object
 *          : form: data will be format into form type to commit like form
 * @httpHeaders:
 *              |- Accept-Charset
 *              |- Accept-Encoding
 *              |- Access-Control-Request-Headers
 *              |- Access-Control-Request-Method
 *              |- Connection
 *              |- Content-Length
 *              |- Cookie
 *              |- Cookie2
 *              |- Date
 *              |- DNT
 *              |- Expect
 *              |- Host
 *              |- Keep-Alive
 *              |- Origin
 *              |- Referer
 *              |- TE
 *              |- Trailer
 *              |- Transfer-Encoding
 *              |- Upgrade
 *              |- User-Agent
 *              |- Via
 */
function httpCall(setting) {
    var config          = (typeof setting === 'object')         ? setting : {};
    config.method       = config.hasOwnProperty("method")       ? config.method         :   "get";
    config.data         = config.hasOwnProperty("data")         ? config.data           :   null;
    config.dataType     = config.hasOwnProperty("dataType")     ? config.dataType       :   "text/html";
    config.url          = config.hasOwnProperty("url")          ? config.url            :   null;
    config.async        = config.hasOwnProperty("async")        ? config.async          :   true;
    config.onInit       = config.hasOwnProperty("onInit")       ? config.onInit         :   null;
    config.onConnect    = config.hasOwnProperty("onConnect")    ? config.onConnect      :   null;
    config.onReceive    = config.hasOwnProperty("onReceive")    ? config.onReceive      :   null;
    config.onProcess    = config.hasOwnProperty("onProcess")    ? config.onProcess      :   null;
    config.onSuccess    = config.hasOwnProperty("onSuccess")    ? config.onSuccess      :   null;
    config.onError      = config.hasOwnProperty("onError")      ? config.onError        :   null;
    config.httpHeaders  = config.hasOwnProperty("httpHeaders")  ? config.httpHeaders    :   null;

    switch (config.dataType) {
        case "json":
            config.data     = JSON.stringify(config.data);
            config.dataType = "application/json";
            break;
        case "form":
            if(typeof config.data === 'object') {
                var formData    = new FormData();
                Object.keys(config.data).forEach((key) => {
                    formData.append(key, config.data[key]);
            });
                config.data     = formData;
            }
            config.dataType = "application/x-www-form-urlencoded";
            break;
        default:
            config.dataType = "application/"+config.dataType;
            config.data     = typeof congid.data === 'object' ? JSON.stringify(config.data) : config.data;
            break;
    }

    var request = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    request.open(config.method, config.url, config.async);

    if(config.httpHeaders && config.httpHeaders.length > 0) {
        for(var i in config.httpHeaders) {
            request.setRequestHeader(config.httpHeaders[i]["key"], config.httpHeaders[i]["value"]);
        }
    }

    request.setRequestHeader("Content-Type", config.dataType);

    request.onreadystatechange = function() {
        switch (request.readyState) {
            case 0:
                if(config.onInit) config.onInit(config, request);
                break;
            case 1:
                if(config.onConnect) config.onConnect(config, request);
                break;
            case 2:
                if(config.onReceive) config.onReceive(config, request);
                break;
            case 3:
                if(config.onProcess) config.onProcess(config, request);
                break;
            case 4:
                if(200 === request.status) {
                    if(config.onSuccess) config.onSuccess(request.responseText);
                }else{
                    if(config.onError) config.onError(request.state, request.responseText);
                }
                break;

        }

    };
    request.send(config.data);
}
