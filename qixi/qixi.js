/*-----------动画结束事件--------*/
var animationEnd = (function() {
	var explorer = navigator.userAgent;
	if (~explorer.indexOf('WebKit')) {
		return "webkitAnimationEnd";
	}
	return "animationend";
})();


/*

	灯动画----------------------------------

*/
var lamp = {
	elem: $('.b_background'),
	bright: function() {
		this.elem.addClass('lamp-bright')
	},
	dark: function() {
		this.elem.removeClass('lamp-bright')
	}
};



function doorAction(left, right, time) {
	var $door = $('.door');
	var doorLeft = $(".door-left");
	var doorRight = $(".door-right");
	var defer = $.Deferred();
	var count = 2;

	//等待开门完成
	var complete = function() {
		if (count === 1) {
			defer.resolve();
			return;
		}
		count--;
	};
	doorLeft.transition({
		'left': left
	}, time, complete);

	doorRight.transition({
		'left': right
	}, time, complete);

	return defer;
}


/*-------------开门关门动画--------------*/
//开门
function openDoor() {
	return doorAction('-50%', '100%', 2000);
}

//关门
function shutDoor() {
	return doorAction('0%', '50%', 2000);
}

var instanceX;



/*
	男孩走路
	@param{[type]} container [description]

*/

function boyWalk() {

	var container = $("#content");
	//页面可视区域
	var visualWidth = container.width();
	var visualHeight = container.height();

	//获取数据
	var getValue = function(className) {
		var $elem = $(className.toString());
		//走路的路线坐标
		return {
			height: $elem.height(),
			top: $elem.position().top
		};
	};

	//路的Y轴
	var pathY = function() {
		var data = getValue('.a_background_middle');
		return data.top + data.height / 2;
	}();
	var $boy = $("#boy");
	var boyWidth = $boy.width();
	var boyHeight = $boy.height();

	//修正小男孩的正确位置
	$boy.css({
		top: pathY - boyHeight + 25
	});

	//暂停走路
	function pauseWalk() {
		$boy.addClass('pauseWalk');
	}

	//恢复走路
	function restoreWalk() {
		$boy.removeClass('pauseWalk');
	}

	//CSS3的动作变化
	function slowWalk() {
		$boy.addClass('slowWalk');
	}

	//用transition做运动
	function startRun(options, runTime) {
		var dfdPlay = $.Deferred();

		//恢复走路
		restoreWalk();

		//运动的属性
		$boy.transition(
			options,
			runTime,
			'linear',
			function() {
				dfdPlay.resolve(); //动画完成
			});
		return dfdPlay;
	}


	/*-------------走进商店-------------------*/
	function walkToShop(runTime) {
		var defer = $.Deferred();
		var doorObj = $('.door');

		//获取门的坐标
		var offsetDoor = doorObj.offset();
		var doorOffsetLeft = offsetDoor.left;
		var doorOffsetTop = offsetDoor.top;

		//获取男孩当前坐标
		var posBoy = $boy.position();
		var boyPoxLeft = posBoy.left;
		var boyPoxTop = posBoy.top;

		//中间位置
		var boyMiddle = $boy.width() / 2;
		var doorMiddle = doorObj.width() / 2;
		var doorTopMiddle = doorObj.height() / 2;


		//当前需要移动的坐标
		instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyPoxLeft + boy.width / 2);

		//Y的坐标
		//top = 人物底部的top - 门中间的top值
		instanceY = boyPoxTop + boyHeight - doorOffsetTop + doorTopMiddle;


		//开始走路
		var walkPlay = startRun({
			transform: 'translateX(' + instanceX + 'px),scale(0.3, 0.3)',
			opacity: 0.1
		}, 2000);

		//走路完毕
		walkPlay.done(function() {
			$boy.css({
				opacity: 0
			});
			defer.resolve();
		})

		return defer;
	}



	/*------------------走出商店-------------*/
	function walkOutShop(runTime) {
		var defer = $.Deferred();
		restoreWalk();

		//开始走路
		var walkPlay = startRun({
			transform: 'translateX(' + instanceX + 'px), scale(1,1)',
			opacity: 1
		}, runTime);

		//走路完毕
		walkPlay.done(function() {
			defer.resolve();
		});
		return defer;
	}



	/*--------------取花----------------*/
	function takeFlower() {
		//增加延时等待效果
		var defer = $.Deferred();
		setTimeout(function() {
			//取花
			$boy.addClass('slowFlolerWalk');
			defer.resolve();
		}, 1000);
		return defer;
	}



	/*-------------------开始走路--------------*/
	function walkRun(time, dist, disY) {
		time = time || 3000;
		//脚动作
		slowWalk();
		//开始走路
		var d1 = startRun({
			'left': dist + 'px',
			'top': disY ? disY : undefined + 'px'
		}, time);
		return d1;
	}

	//计算移动距离
	function calculateDist(direction, proportion) {
		return (direction == 'x' ? visualWidth : visualHeight) * proportion;
	}

	return {
		//开始走路
		walkTo: function(time, proportionX, proportionY) {
			var distX = calculateDist('x', proportionX);
			var distY = calculateDist('y', proportionY);
			return walkRun(time, distX, distY);
		},

		//走进商店
		toShop: function() {
			return walkToShop.apply(null, arguments);
		},

		//走出商店
		outShop: function() {
			return walkOutShop.apply(null, arguments);
		},

		//停止走路
		stopWalk: function() {
			pauseWalk();
		},
		setColoer: function(value) {
			$boy.css('background-color', value);
		},

		//获取男孩宽度
		getWidth: function() {
			return $boy.width();
		},
		getHeight: function() {
			return $boy.height();
		},
		//复位初始状态
		resetOriginal: function() {
			this.stopWalk();
			//恢复图片
			$boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
		},
		rotate: function(callback) {
			restoreWalk();
			$boy.addClass('boy-rotate');
			//监听转身完毕
			if (callback) {
				$boy.on(animationEnd, function() {
					callback();
					$(this).off();
				})
			}
		},
		//取花
		takeF: function() {
			return takeFlower();
		},
		//
		setFlolerWalk: function() {
			$boy.addClass('slowFlolerWalk');
		}
	}
}
