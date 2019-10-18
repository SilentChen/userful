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
