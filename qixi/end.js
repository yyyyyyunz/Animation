$(function() {

	var container = $("#content");
	var swipe = Swipe(container);
	var visualWidth = container.width();
	var visualHeight = container.height();

	//页面滚动

	function scrollTo(time, proportionX) {
		var distX = container.width() * proportionX;
		swipe.scrollTo(distX, time);
	}

	//获取数据
	var getValue = function(className) {
		var $elem = $(className.toString());
		return {
			height: $elem.height(),
			top: $elem.position().top
		};
	};


	//桥的Y轴
	var bridgeY = function() {
		var data = getValue(".c_background_middle");
		return data.top;
	}();

	var waterY = function() {
		var data = getValue(".c_background_botton");
		return data.top;
	}();


	/*---------飞鸟---------*/
	var bird = {
		elem: $(".bird"),
		fly: function() {
			this.elem.addClass('birdFly');
			this.elem.transition({
				right: container.width()
			}, 15000, 'linear');
		}
	};


	/*------------小女孩---------------*/
	var girl = {
		elem: $('.girl'),
		getHeight: function() {
			return this.elem.height();
		},
		//转身动作
		rotate: function() {
			this.elem.addClass('girl-rotate');
		},
		setOffset: function() {
			this.elem.css({
				left: visualWidth / 2,
				top: bridgeY - this.getHeight()
			});
		},
		getOffset: function() {
			return this.elem.offset();
		},
		getWidth: function() {
			return this.elem.width();
		}
	};

	//修正女孩的位置
	girl.setOffset();



	/*---------------飘雪花-----------------*/

	var snowflakeURL = [
		'F:/Web/七夕/images/snowflake/snowflake1.png',
		'F:/Web/七夕/images/snowflake/snowflake2.png',
		'F:/Web/七夕/images/snowflake/snowflake3.png',
		'F:/Web/七夕/images/snowflake/snowflake4.png',
		'F:/Web/七夕/images/snowflake/snowflake5.png',
		'F:/Web/七夕/images/snowflake/snowflake6.png'
	]


	/*------------飘雪花--------*/
	function snowflake() {
		//雪花容器
		var $flakeContainer = $("#snowflake");

		//随机六张图
		function getImagesName() {
			return snowflakeURL[Math.floor(Math.random() * 6)];
		}
		//创建一个雪花元素
		function createSnowBox() {
			var url = getImagesName();
			return $('<div class="snowbox" />').css({
				"width": 41,
				"height": 41,
				"position": "absolute",
				"backgroundSize": "cover",
				"z-index": 10,
				"top": "-41px",
				"backgroundImage": 'url(' + url + ')'
			}).addClass('snowRoll');
		}
		//开始飘花
		setInterval(function() {
			//运动的轨迹
			var startPositionLeft = Math.random() * visualWidth - 100,
				startOpacity = 1,
				endPositionTop = visualHeight - 40,
				endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
				duration = visualHeight * 10 + Math.random() * 5000;

			//随机透明度，不小于0,5
			var randomStart = Math.random();
			randomStart = randomStart < 0.5 ? startOpacity : randomStart;

			//创建一个雪花
			var $flake = createSnowBox();

			//设计起点位置
			$flake.css({
				left: startPositionLeft,
				opacity: randomStart
			});

			//加入到容器
			$flakeContainer.append($flake);

			//开始执行动画
			$flake.transition({
				top: endPositionTop,
				left: endPositionLeft,
				opacity: 0.7
			}, duration, "ease-out", function() {
				$(this).remove() //结束后删除
			});
		}, 200);
	}



	/*---------------音乐配置---------------*/

	var audioConfig = {
		enable: true, //是否开启音乐
		playURL: "F:/Web/七夕/music/HeyJude.mp3", //正常播放地址
		cycleURL: "F:/Web/七夕/music/Berlin.mp3" //正常循环播放地址
	};

	/*----背景音乐----*/

	function Html5Audio(url, isloop) {
		var audio = new Audio(url);
		audio.autoPlay = true;
		audio.loop = isloop || false;
		audio.play();
		return {
			end: function(callback) {
				audio.addEventListener('ended', function() {
					callback();
				}, false);
			}
		};
	}


	/*---------------动画处理---------------*/

	/*-----男孩走路------*/
	var boy = boyWalk();



	/*------------pageA--------------*/
	//太阳公转
	$("#sun").addClass('rotation');

	//飘云
	$(".cloud:first").addClass('cloud1Anim');
	$(".cloud:last").addClass("cloud2Anim");


	//开始第一次走路
	boy.walkTo(6000, 0.6) //第一次走路完成
		.then(function() {
			//开始页面滚动
			scrollTo(10000, 1);
			//第二次走路
			return boy.walkTo(10000, 0.5);
		}).then(function() {
			//男孩停止
			boy.stopWalk();
		}).then(function() {
			//开门
			return openDoor();
		}).then(function() {
			//开灯
			lamp.bright();
		}).then(function() {
			//进商店
			return boy.toShop(2000);
		}).then(function() {
			//取花
			return boy.takeF();
		}).then(function() {
			//出商店
			return boy.outShop();
		}).then(function() {
			//飞鸟
			bird.fly();
		}).then(function() {
			//关灯
			lamp.dark();
		}).then(function() {
			//关门
			return shutDoor();
		}).then(function() {
			//恢复走路
			scrollTo(10000, 2);
			boy.walkTo(10000, 0.15);

		}).then(function() {
			return boy.walkTo(1500, 0.25, (bridgeY - girl.getHeight()) / visualHeight);
		}).then(function() {
			//实际走路的比例
			var proportionX = (girl.getOffset().left - boy.getWidth() + girl.getWidth() / 5) / visualWidth;
			//第三次桥上直走到小女孩面前
			return boy.walkTo(1500, proportionX);
		}).then(function() {
			//图片还原原地停止状态
			boy.resetOriginal();
		}).then(function() {
			setTimeout(function() {
				girl.rotate();
				boy.rotate();
			}, 1000);
		}).then(function() {
			snowflake();
		});

		

		$("button:first").click(function() {
			var audio1 = Html5Audio(audioConfig.playURL);
			audio1.end(function() {
				Html5Audio(audioConfig.cycleURL, true);
			});
		});

		
})
