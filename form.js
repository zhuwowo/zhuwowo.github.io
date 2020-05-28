/*
	init_form('#id', {"username": "tom", "password": "123456"});
	clear_form('#id');
	get_form_params('#id');
	init_select('#id', [1, 2]);
	disable_form('#id');
	enable_form('#id');
*/
function init_form(selector,data){
	clear_form(selector);
	var element = document.querySelector(selector);
	Array.prototype.slice.call(element.querySelectorAll("input,textarea,select")).forEach(function(ele){
		if(ele.type == 'checkbox'){
			if (ele.id && Array.isArray(data[ele.id]) && data[ele.id].indexOf(ele.value)>-1) {
				ele.checked = true;
			} else if(Array.isArray(data[ele.name]) && data[ele.name].indexOf(ele.value)>-1){
				ele.checked = true;
			} else if (ele.id && data[ele.id]==ele.value) {
				ele.checked = true;
			} else if (ele.name && data[ele.name]==ele.value) {
				ele.checked = true;
			}
		} else if(ele.type == 'radio') {
			if (ele.id && data[ele.id] == ele.value ) {
				ele.checked = true;
			} else if(data[ele.name] == ele.value){
				ele.checked = true;
			}
		} else if(ele.tagName == 'SELECT') {
			if (ele.id) {
				if (Array.isArray(data[ele.id])) {
					Array.prototype.slice.call(ele.options).forEach(function(opt){
						if (data[ele.id].indexOf(opt.value)>-1) { opt.selected = true; };
					});
				} else {
					Array.prototype.slice.call(ele.options).forEach(function(opt){
						if (opt.value == data[ele.id]) { opt.selected = true; };
					});
				}
			} else {
				if (Array.isArray(data[ele.name])) {
					Array.prototype.slice.call(ele.options).forEach(function(opt){
						if (data[ele.name].indexOf(opt.value)>-1) { opt.selected = true; };
					});
				} else {
					Array.prototype.slice.call(ele.options).forEach(function(opt){
						if (opt.value == data[ele.name]) { opt.selected = true; };
					});
				}
			}
		} else {
			if (ele.id) {
				ele.value = data[ele.id];
			} else {
				ele.value = data[ele.name];
			}
		}
	});
}

function clear_form(selector){
	var element = document.querySelector(selector);
	Array.prototype.slice.call(element.querySelectorAll("input,textarea,select")).forEach(function(ele){
		if(ele.type == 'checkbox'){
			ele.checked = false;
		} else if(ele.type == 'radio') {
			ele.checked = false;
		} /*else if(ele.tagName == 'SELECT' && ele.multiple) {
			Array.prototype.slice.call(ele.options).forEach(function(opt){
				if (opt.selected) {opt.selected = false;};
			});
		}*/ else {
			ele.value = "";
		}
	});
}

function get_form_params(selector) {
	var element = document.querySelector(selector);
	var params = {};
	Array.prototype.slice.call(element.querySelectorAll("input,textarea,select")).forEach(function(ele) {
		if(ele.type == 'checkbox'){
			if(ele.id){
				if (ele.id in params) {
					if(ele.checked){
						if (Array.isArray(params[ele.id])) {
							params[ele.id].push(ele.value);
						} else {
							params[ele.id] = [ele.value];
						}
					}
				} else {
					if(ele.checked){
						params[ele.id] = [ele.value];
					} else {
						params[ele.id] = [];
					}
				}
			} else {
				if (ele.name in params) {
					if(ele.checked){
						if (Array.isArray(params[ele.name])) {
							params[ele.name].push(ele.value);
						} else {
							params[ele.name] = [ele.value];
						}
					}
				} else {
					if(ele.checked){
						params[ele.name] = [ele.value];
					} else {
						params[ele.name] = [];
					}
				}
			}
		} else if(ele.type == 'radio') {
			// 以id作为参数的key
			if(ele.id){
				// params里面有这个key，如果勾选的话，直接赋值
				if (ele.id in params) {
					if (ele.checked) {
						params[ele.id] = ele.value;
					}
				// params里面没有这个key，直接赋值
				} else {
					if (ele.checked) {
						params[ele.id] = ele.value;
					} else {
						params[ele.id] = null;
					}
				}
			// 以name作为参数的key
			} else {
				if (ele.name in params) {
					if (ele.checked) {
						params[ele.name] = ele.value;
					}
				} else {
					if (ele.checked) {
						params[ele.name] = ele.value;
					} else {
						params[ele.name] = null;
					}
				}
			}
		// 先处理SELECT多选的情况
		} else if(ele.tagName == 'SELECT' && ele.multiple) {
			var opts = [];
			if(ele.id){
				Array.prototype.slice.call(ele.options).forEach(function(opt){
					if (opt.selected) {opts.push(opt.value);};
				});
				params[ele.id] = opts;
			} else {
				Array.prototype.slice.call(ele.options).forEach(function(opt){
					if (opt.selected) {opts.push(opt.value);};
				});
				params[ele.name] = opts;
			}
		} else {
			// type="text"/textarea 数据处理
			if(ele.id){
				params[ele.id] = ele.value;
			} else {
				params[ele.name] = ele.value;
			}
		}
	});
	console.log(params);
	return params;
}

function init_select(selector,data){
	var o_select = document.querySelector(selector);
	o_select.innerHTML = "";
	(Array.isArray(data)?data:[data]).forEach(function(item){
		o_select.appendChild(new Option(item,item,false,false));
	});
}

/*待定，是否删除*/
function init_select_opts_from_url(selector,uri,method,arr_path){
	$.ajax({
		url: uri,
		type: method?method:'GET',
		async: true,
		success: function(data){
			if (!arr_path) {
				init_select(selector, data);
			} else if (arr_path.indexOf('.')>-1) {

				// ????????????????????????
				init_select(selector, data);
			} else {
				init_select(selector, data[arr_path]);
			}
		}
	});
}

function disable_form(selector){
	if (Array.isArray(selector)) {
		selector.forEach(function(stor){
			document.querySelector(stor).setAttribute('disabled',true);
		});
	} else {
		var element = document.querySelector(selector);
		Array.prototype.slice.call(element.querySelectorAll("input,textarea,select")).forEach(function(ele){
			ele.setAttribute('disabled',true);
		});
	}
}

function enable_form(selector){
	if (Array.isArray(selector)) {
		selector.forEach(function(stor){
			document.querySelector(stor).removeAttribute('disabled');
		});
	} else {
		var element = document.querySelector(selector);
		Array.prototype.slice.call(element.querySelectorAll("input,textarea,select")).forEach(function(ele){
			ele.removeAttribute('disabled');
		});
	}
}