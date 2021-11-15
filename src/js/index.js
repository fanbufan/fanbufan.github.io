window.onload = function () {
  init();
}

function init() {
  initGame();
}

var initGame = (function () {
  var oWrap = document.getElementsByClassName('wrap')[0],
    wrapWidth = parseInt(getStyle(oWrap, 'width')),
    wrapHeight = parseInt(getStyle(oWrap, 'height')),
    oDirBtns = document.getElementsByClassName('dir-btn'),
    dirLen = oDirBtns.length,
    tMove = null;

  var Snake = function () {
    this.bodyArr = [
      { x: 0, y: 0 },
      { x: 0, y: 20 },
      { x: 0, y: 40 },
      { x: 0, y: 60 },
      { x: 0, y: 80 },
      { x: 0, y: 100 },
    ];
    this.dir = 'DOWN';
    this.foodPos = {};
  };

  Snake.prototype = {
    init: function () {
      this.bindEvent();
      this.initSnake();
      this.run();
      this.createFood();
    },

    bindEvent: function () {
      var _self = this;

      addEvent(document, 'keydown', function () {
        _self.changeDir();
      });

      for (var i = 0; i < dirLen; i++) {
        addEvent(oDirBtns[i], 'click', function () {
          _self.changeDir();
        })
      }

    },

    initSnake: function () {
      var arr = this.bodyArr,
        len = arr.length,
        item,
        frag = document.createDocumentFragment();

      for (var i = 0; i < len; i++) {
        item = arr[i];
        var round = document.createElement('i');
        round.style.left = item.x + 'px';
        round.style.top = item.y + 'px';

        round.className = i === arr.length - 1 ? 'round' : 'round head';
        frag.appendChild(round);
      }

      oWrap.appendChild(frag);
    },

    run: function () {
      var _self = this;
      tMove = setInterval(() => {
        _self.move();
      }, 500);
    },

    move: function () {
      var arr = this.bodyArr,
        len = arr.length;

      for (var i = 0; i < len; i++) {
        if (i === len - 1) {
          this.setHeadXY(arr);
        } else {
          arr[i].x = arr[i + 1].x;
          arr[i].y = arr[i + 1].y;
        }
      }

      this.removeSnake();
      this.initSnake();
      this.headInBody(arr);
      this.eatFood(arr)
    },

    setHeadXY: function (arr) {
      var head = arr[arr.length - 1];
      switch (this.dir) {
        case 'LEFT':
          if (head.x <= 0) {
            head.x += wrapWidth - 20;
          } else {
            head.x -= 20;
          }
          break;
        case 'RIGHT':
          if (head.x >= wrapWidth - 20) {
            head.x = 0;
          } else {
            head.x += 20;
          }
          break;
        case 'UP':
          if (head.y <= 0) {
            head.y += wrapHeight - 20;
          } else {
            head.y -= 20;
          }
          break;
        case 'DOWN':
          if (head.y >= wrapHeight - 20) {
            head.y = 0;
          } else {
            head.y += 20;
          }
          break;
        default:
          break;
      }
    },

    headInBody: function (arr) {
      var len = arr.length,
        head = arr[len - 1],
        _self = this;

      for (var i = 0; i < len - 2; i++) {
        if (head.x === arr[i].x && head.y === arr[i].y) {
          setTimeout(() => {
            alert('游戏结束~');
            clearInterval(tMove);
            _self.removeSnake();
          }, 300);
        }
      }
    },

    removeSnake: function () {
      var snakeBodys = document.getElementsByClassName('round');

      while (snakeBodys.length > 0) {
        snakeBodys[0].remove();
      }
    },

    changeDir: function (e) {
      var e = e || window.event,
        tar = e.target || window.srcElement,
        code = e.keyCode;

      if (!e.keyCode) {
        code = this.dirCode(tar.getAttribute('dir'));
      }

      this.setDir(code);
    },

    dirCode: function (dir) {
      var code;

      switch (dir) {
        case 'LEFT':
          code = 37;
          break;
        case 'TOP':
          code = 38;
          break;
        case 'RIGHT':
          code = 39;
          break;
        case 'BOTTOM':
          code = 40;
          break;
        default:
          break;
      }

      return code;
    },

    setDir: function (code) {
      switch (code) {
        case 37:
          if (this.dir !== 'LEFT' && this.dir !== 'RIGHT') {
            this.dir = 'LEFT';
          }
          break;
        case 39:
          if (this.dir !== 'LEFT' && this.dir !== 'RIGHT') {
            this.dir = 'RIGHT';
          }
          break;
        case 38:
          if (this.dir !== 'UP' && this.dir !== 'DOWN') {
            this.dir = 'UP';
          }
          break;
        case 40:
          if (this.dir !== 'UP' && this.dir !== 'DOWN') {
            this.dir = 'DOWN';
          }
          break;
        default:
          break;
      }
    },

    createFood: function () {
      var food = document.createElement('i');
      this.foodPos = this.setRandomPos();

      food.className = 'food';
      food.style.left = this.foodPos.posX + 'px';
      food.style.top = this.foodPos.posY + 'px';
      oWrap.appendChild(food);
    },

    setRandomPos: function () {
      var posX = Math.floor(Math.random() * (wrapWidth / 20)) * 20,
        posY = Math.floor(Math.random() * (wrapHeight / 20)) * 20;
      return { posX, posY }
    },

    eatFood: function (arr) {
      var head = arr[arr.length - 1],
        newSnakePoint = {};

      if (head.x === this.foodPos.posX && head.y === this.foodPos.posY) {
        if (arr[0].x === arr[1].x) {
          newSnakePoint.x = arr[0].x;
          newSnakePoint.y = arr[0].y > arr[1].y ? arr[0].y + 20 : arr[0].y - 20;
        } else {
          newSnakePoint.y = arr[0].y;
          newSnakePoint.x = arr[0].x > arr[1].x ? arr[0].x + 20 : arr[0].x - 20;
        }

        arr.unshift(newSnakePoint);
        this.initSnake();
        this.removeFood();
        this.createFood();
      }
    },

    removeFood: function () {
      var food = document.getElementsByClassName('food')[0];
      food.remove();
    }
  };

  new Snake().init();
});