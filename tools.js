var wxTools = {

	$: function (selector,context){
		context = context || document;
		var firstChar = selector.charAt(0);
		if( firstChar == "#" ){
			return document.getElementById(selector.substring(1));
		} else if ( firstChar == "." ){
			return context.getElementsByClassName(selector.substring(1));
		} else {
			return context.getElementsByTagName(selector);
		}
	},

	getStyle: function (obj,attr) {
		return obj.currentStyle ? obj.currentStyle[attr]:getComputedStyle(obj)[attr];
	},

	futurefun: function (timeStr){
		var now = new Date();
		var future = new Date(timeStr);

		var time = (future.getTime() - now.getTime())/1000;

		var Day = Math.floor(time/86400);
		var Hour = Math.floor(time%86400/3600);
		var Minute = Math.floor(time%86400%3600/60);
		var Second = Math.floor(time%60);
		var onOff = true;
		if( time <= 0 ) onOff = false;
		var json = {
			D:Day,
			H:Hour,
			Min:Minute,
			S:Second,
			onOff:onOff,
		}
		return json;
	},

	AddZo: function (m){
		if(m<0) return m;
		if( m >= 10 ){
			return m;
		}else{
			return '0' + m;
		}
	},

	insertAfter: function (newElement,targetElement){ //newElement为插入的新节点，targetElement为插入到谁后边的目标节点
		
		var parent = targetElement.parentNode; // 先获取到目标节点的父级
		if( parent.lastChild == targetElement ){  // 如果目标节点是父级的最后一个元素，就调用appendChild方法
			parent.appendChild(newElement);    
		} else {  // 否则调用insertBefore方法，把新节点插入到目标元素下一个节点的前面
			parent.insertBefore(newElement,targetElement.nextSibling);
		}
	},

	hasClass: function (element,classNames){ // 传入两个参数，要查找element下面的class有没有className的类名
		var allClass = element.className.split(" "); // 分割成数组
		for( var i = 0; i < allClass.length; i++ ){  // 循环遍历
			if( allClass[i] === classNames ){  // 有的话返回true
				return true; 
			}
		}
		return false;  // 没有的话返回false
	},

	addClass: function (element,classNames){
		var classAll = element.className;
		if( !wxTools.hasClass(element,classNames) ){
			if( classAll.trim() === "" ){
				element.className = classNames;
				return;
			}
			element.className += " " + classNames;
		}
	},

	removeClass: function (element,classNames){
		var classAll = element.className.split(" ");
		if( wxTools.hasClass(element,classNames) ){	
			for( var i = 0; i < classAll.length; i++ ){
				if( classAll[i] === classNames ){
					classAll.splice(i,1);
					i--;
				}
			}	
		}
		element.className = classAll.join(" ");

		if( classAll.length === 0 ){
			element.removeAttribute("class");
		}
	},

	toggleClass: function (element,classNames){
		if( !wxTools.hasClass(element,classNames) ){
			wxTools.addClass(element,classNames);
			return true;
		} else {
			wxTools.removeClass(element,classNames);
			return false;
		}
	},

	getScroll: function (){
		return {
			T: document.documentElement.scrollTop || document.body.scrollTop,
			L: document.documentElement.scrollLeft || document.body.scrollLeft
		}	
	},

	getWin: function (){
		return {
			W: document.documentElement.clientWidth, 
			H: document.documentElement.clientHeight
		}
	}

}

