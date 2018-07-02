/**
 * 计算器滑动模块
 * @param {object} options
 * @param {jquery} options.bar
 * @param {jquery} options.btn
 * @param {Array} options.data
 */
class Slider {
  constructor(options) {
    this.options = options;
    this.init();
  }

  init() {
    let ins = this;
    if (ins.options.steps) {
      return; // 只init一次-
    }
    // 将整个bar分隔成N个宽度-
    let steps = [];
    let w = (ins.options.bar[0].offsetWidth - 10) / (ins.options.data.length - 1);
    ins.options.data.forEach(function (v, i) {
      steps[i] = w * i;
    });
    ins.options.steps = steps;
    let $v = ins.options.btn.parent();
    let val = $v.data('value');
    if (!val) {
      val = ins.options.data[0];
    }
    ins.setValue(val);
    ins.options.data.forEach(function (v, i) {
      if (val == v) {
        $v.width(ins.options.steps[i]);
      }
    });

    // 绑定btn事件-
    ins.bindEvent();
  };
  setValue(value) {
    this.options.btn.html(value).parent().data('value', value);
  };
  bindEvent() {
    let ins = this;
    let $b = ins.options.btn;
    let $v = $b.parent();
    let x0 = 0, // 鼠标按下位置-
      x1 = 0, // 鼠标移动过程的位置-
      w0 = 0, // 滑动前的value大小-
      w2 = ins.options.bar[0].offsetWidth;

    $b.on('mousedown touchstart', function (event) {
      x0 = event.clientX || event.touches[0].clientX;
      w0 = $v.width();
    }).on('mousemove touchmove', function (event) {
      if (x0 == 0) return;
      x1 = event.clientX || event.touches[0].clientX;
      let w1 = w0 + x1 - x0;
      if (w1 > w2) return;
      $v.width(w1);
      let val = getNewValue(w1);
      if (val != $v.data('value')) {
        ins.setValue(val);
      }
    }).on('mouseup touchend', function (event) {
      x0 = x1 = 0;
    });

    // 根据当前value宽度获取对应的data-
    function getNewValue(w) {
      let max = 0;
      ins.options.steps.forEach(function (v, i) {
        if (w > v) max = i;
      });
      return ins.options.data[max];
    }

  };
}

export default Slider;
