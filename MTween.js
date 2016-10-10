var wTn = {

	// 抖函数 obj为抖动的元素，attr为要变化的属性，A为振幅，f为频率，fn为回掉函数，抖动结束执行
	shake: function (obj,attr,A,f,fn){
		if( timer ) return;
		var arr = [];
		var n = 0;
		for( var i = A; i >= 0; i -= f ){
			arr.push(i,-i);
		}
		arr.push(0);
		var l = parseInt(getStyle(obj,attr));
		timer = setInterval( function (){
			obj.style[attr] = l + arr[n] + "px";
			n++;
			if( n > arr.length - 1 ){
				n = 0;
				clearInterval( timer );
				timer = null;
				typeof fn === "function" && fn();
			}
		},16 )
	},
	// sTween为单属性运动
	MTween: function (obj,attr,duration,target,fx,callBack){
		/*
		MTween 为单属性运动函数
		    参数说明：obj表示运动元素，attr表示运动的属性，duration表示持续时间
		    target表示运动目标值，fx表示运动形式，callBack可选参数，运动完成后执行的回调函数
		*/
		var current = new Date().getTime();
		var b = parseFloat(getComputedStyle(obj)[attr]);
		var c = target - b;
		var d = duration;
		clearInterval(obj.timer);
		obj.timer = setInterval(function (){
			var t = new Date().getTime() - current;

			if( t >= d ){
				clearInterval(obj.timer);
				// 停止运动之后，把timer设为空
				obj.timer = null;
				t = d;
			}

			var value = Tween[fx](t, b, c, d);
			if( attr === "opacity" ){
				obj.style[attr] = value;
			}else{
				obj.style[attr] = value + "px";
			}
			
			//必须等运动的值赋值为完成之后，才算真正的结束了。
			//如果t等于d，肯定运动到了规定的事件，就执行回调函数
			if( t === d ){
				/*if( typeof callBack === "function"){
					callBack();
				}*/

				 typeof callBack === "function" && callBack();
			}

		},16)
	},

	// MTween1为多属性同步运动
	aTween: function (obj,attrObj,duration,fx,callBack){
		//每一个属性对应的起始位置和结束为止，通过这两个算出总距离
		/*
			attrObj:{
					left:500,
					top:1000
				}
		*/
		var newObj = {}

		for( var attr in attrObj ){
			newObj[attr] = {};
		}
		for( var attr in attrObj ){
			newObj[attr].b = parseFloat(getComputedStyle(obj)[attr]);
			newObj[attr].c = attrObj[attr] - newObj[attr].b;
		}


		var current = new Date().getTime();
		var d = duration;
		fx = fx || "linear";

		//能不能要运动的属性作为某个对象的key值，用来保存定时器

		clearInterval(obj.timer);
		obj.timer = setInterval(function (){
			var t = new Date().getTime() - current;

			if( t >= d ){
				clearInterval(obj.timer);

				//停止运动之后，把timer设为空
				obj.timer = null;
				t = d;	
			}

			for( var attr in attrObj ){
				//找对应运动属性的起始位置和总距离
				var value = Tween[fx](t, newObj[attr].b, newObj[attr].c, d);
				//判断设置的是透明度，那么不用加单位
				if( attr === "opacity" ){
					obj.style[attr] = value;
				}else{
					obj.style[attr] = value + "px";
				}
			}
			if( t === d ){
				 typeof callBack === "function" && callBack();
			}

		},16)
	},

	// mTween2为多属性可不同步函数
	// objAttr = { width:{tar:300,dur:1000}, height:{tar:300,dur:2000} }
	mTween: function (obj,objAttr,fx,callBack){
		var current = new Date().getTime();

		var newAttrObj = {};
		for( var attr in objAttr ){
			newAttrObj[attr] = {};
		}
			
		for( var attr in objAttr ){
			for( var attr1 in objAttr[attr] ){
				console.log(attr1);
				newAttrObj[attr].b = parseInt(getComputedStyle(obj)[attr]);
				if( attr1 === "tar" ){
					newAttrObj[attr].c = objAttr[attr][attr1] - newAttrObj[attr].b;
				} else if( attr1 === "dur" ){
					newAttrObj[attr].d = objAttr[attr][attr1];
				}
			}
		}
		
		fx = fx || "linear";

		for( var attr in newAttrObj ){

			~function (attr){
				if( obj[attr] ) return;
				clearInterval(obj[attr]);
				obj[attr] = setInterval(function (){
					console.log(newAttrObj[attr],attr,obj[attr]);
				 	var t = new Date().getTime() - current;
				 	var d = newAttrObj[attr].d;
				 	if( t >= d ){
				 		clearInterval(obj[attr]);
				 		// 停止运动之后，把timer设为空
				 		obj[attr] = null;
				 		t = d;
				 	}

				 	var value = Tween[fx](t, newAttrObj[attr].b, newAttrObj[attr].c, newAttrObj[attr].d);
				 	console.log(t, newAttrObj[attr].b, newAttrObj[attr].c, newAttrObj[attr].d)
				 	console.log(value);
				 	if( attr === "opacity" ){
				 		obj.style[attr] = value;
				 	}else{
				 		obj.style[attr] = value + "px";
				 	}
					
				 	//必须等运动的值赋值为完成之后，才算真正的结束了。
				 	//如果t等于d，肯定运动到了规定的事件，就执行回调函数
				 	if( t === d ){
				 		typeof callBack === "function" && callBack();
				 	}

				},16)
			}(attr)	
		}
	},
	/*
		wMTween 为多属性非同步运动函数，可传入任意几个属性的运动参数的字符串，每个属性下对应6个参数
		第一个为运动的属性名，第二个为目标位置，第三个运动持续时间，第四个为延迟时间，第五个为运动方式，最后一个是回调函数
		前三个参数是必传的，后三个参数为可选参数
		说明：此运动函数解决了必传和可选参数之间的判断问题，以及函数之间或者函数内部多个空格的问题，
	以及参数超过6个参数，既不会起作用也不会报错。
	*/
	//objAttr = "width 200 1s 2s linear function (){console.log(1)},height 200 2s 1s linear function (){console.log(2)},opacity 0 4s 6s linear function fn(){console.log(789)}";
	wTween:function (obj,objAttr){
		
		var arr1 = objAttr.split(",");   // 用","讲字符串分割成一个数组，数组的项数为运动属性的个数，称为属性数组
		var newObjAttr = {};
			
		for( var i = 0; i < arr1.length; i++ ){  // 循环属性数组中的每一项

			var arr = arr1[i].split(" function"); // 将函数和前边的参数分开，判断更清晰，代码更优化
		
			var arr2 = arr[0].split(" "); // 将每一个属性数组中的具体运动参数分割成参数数组

			newObjAttr[""+arr2[0]] = {};  // 创建一个newObjAttr的对象

			if( arr.length !== 1 ){  // 如果arr的length不是1，说明有回调函数传入
				newObjAttr[""+arr2[0]].callBack = eval("("+" function"+arr[1]+")");
				console.log()
			}

			for( j = 0; j < arr2.length; j++ ){

				newObjAttr[""+arr2[0]]["tar"] = parseFloat(arr2[1]); // newObjAttr[attr].tar存储当前属性要运动的目标位置
				newObjAttr[""+arr2[0]]["b"] = parseFloat(getComputedStyle(obj)[""+arr2[0]]); // newObjAttr[attr].b存储当前属性的位置
				newObjAttr[""+arr2[0]]["d"] = parseFloat(arr2[2])*1000; // newObjAttr[attr].d 存储运动持续时间
				newObjAttr[""+arr2[0]]["c"] = newObjAttr[""+arr2[0]]["tar"] - newObjAttr[""+arr2[0]]["b"]; // newObjAttr[attr].c 存储运动了多少距离
				
				if( arr2.length === 5 ){ // 所有参数都有的情况，arr2的length为5
					
					newObjAttr[""+arr2[0]]["delay"] = parseFloat(arr2[3])*1000;  // newObjAttr[attr].delay 存储运动延迟时间
					newObjAttr[""+arr2[0]]["fx"] = arr2[4];  // newObjAttr[attr].fx 存储运动方式
				
				} else if ( arr2.length === 4 ){ // 没传delay 或者 没传linear运动方式的情况
					
					if( arr2[3].charAt(arr2[3].length - 1) === "s" ){ // 判断arr2[3]的最后一位是不是"s"，是"s"为delay，不是"s"为linear
						newObjAttr[""+arr2[0]]["delay"] = parseFloat(arr2[3])*1000;
						newObjAttr[""+arr2[0]]["fx"] = "linear";
					} else {
						newObjAttr[""+arr2[0]]["delay"] = 0;
						newObjAttr[""+arr2[0]]["fx"] = arr2[3];
					}

				} else { // 没有delay,"linear"的情况
					newObjAttr[""+arr2[0]]["delay"] = 0; 
					newObjAttr[""+arr2[0]]["fx"] = "linear"; // newObjAttr[attr].fx 如果没有传，默认为"linear"
				}
			}
		}

		for( var attr in newObjAttr ){
				
			~function (attr){
				// 判断当前这种属性的定时器是否存在，解决连续点击重复执行问题
				if( obj[attr+"2"] ) return;
	 			obj[attr+"2"] = setTimeout(function (){  // obj[attr+"2"]这个定时器是延迟delay时长的定时器
	 				console.log(123456789);
	 				var current = new Date().getTime();
					clearInterval(obj[attr]);
					obj[attr] = setInterval(function (){
						
					 	var t = new Date().getTime() - current;
					 	var d = newObjAttr[attr].d;
					 	var n = 0;
					 	if( t >= d ){
					 		clearInterval(obj[attr]);
					 		t = d;
					 	}

					 	var value = Tween[newObjAttr[attr].fx](t, newObjAttr[attr].b, newObjAttr[attr].c, d);
					 	
					 	if( attr === "opacity" ){
					 		obj.style[attr] = value;
					 	}else{
					 		obj.style[attr] = value + "px";
					 	}

					 	if( t === d ){ // 当运动执行完成后再判断回调函数是否传入，如果传入就执行
					 		typeof newObjAttr[attr].callBack === "function" && newObjAttr[attr].callBack();
					 	}

					},16)

	 			},(newObjAttr[attr].delay))

			}(attr)
		}
	}
}

/*
* t : time 已过时间
* b : begin 起始值
* c : count 总的运动值
* d : duration 持续时间
*/

var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}