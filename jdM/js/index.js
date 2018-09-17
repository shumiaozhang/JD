/**
 * Created by Sapling on 2018/9/15.
 */
document.addEventListener('DOMContentLoaded',function () {
    /*轮播图*/
    /*1. 自动播放  无缝衔接  滑动衔接*/
    /*2. 点滚动*/
    /*3. 滑动功能*/
    /*4. 当滑动结束  如果滑动的距离较小  吸附回去 */
    /*5. 当滑动结束  如果滑动的距离较大  动画切换  (上一张|下一张)*/
    /*6. 当滑动结束  如果速度较快 动画切换  (上一张|下一张) */

    // 计算移动的宽度
    var banner = document.querySelector('.jd_banner');
    var width = banner.offsetWidth;
    // 点图片
    var imgObj = banner.querySelector('ul:first-child');
    // 点容器
    var point = banner.querySelector('ul:last-child');
    var addTranstition = function () {
        imgObj.style.transition = 'all 0.2s';
        imgObj.style.webkitTransition = 'all 0.2s';
    }
    var delTranstition = function () {
        imgObj.style.transition = 'none';
        imgObj.style.webkitTransition = 'none';
    }
    var setTranstition = function (translateX) {
        imgObj.style.transform = 'translateX('+ translateX+'px)';
        imgObj.style.webkitTransform = 'translateX('+ translateX+'px)';
    }
    var index = 1;
    var timer = null;
    var autoplay = function () {
        timer = setInterval(function () {
            index ++;
            // 只要属性发生就能过渡
            //先加过渡再改属性改变定位
            addTranstition();
            setTranstition(-index * width);
        },2000);
    };
    autoplay();
//transitionend 过渡执行完的事件   // 无缝衔接
    imgObj.addEventListener('transitionend', function () {
        if(index >= 9){
            index = 1;
            delTranstition();
            setTranstition(-index * width);
        } // 滑动衔接
        else if(index <= 0){
            index = 8;
            delTranstition();
            setTranstition(-index * width);
        }
        setPoint();
    });

    // 点  9对应0
    var setPoint = function () {
        point.querySelector('li.now').classList.remove('now');// 去除now
        point.querySelector('li:nth-child(' + index + ')').classList.add('now');
    }


    var startX = 0;
    var changeX = 0;
    var startTime = 0;
    imgObj.addEventListener('touchstart', function (e) {
        clearInterval(timer);

        //  获取起始的位置  正负无影响 -index*width + 20px(右)  ，左本身就是负再减还是正
        startX = e.touches[0].clientX;
        startTime = Date.now(); // 当前的时间
    });
    // 滑动功能
    imgObj.addEventListener('touchmove', function (e) {
        var moveX = e.touches[0].clientX; // 移动的位置
        // 改变的位置
        changeX = moveX - startX;
        // 将要移动的位置= 原来的位置+ 改变的位置
        var translateX = -index * width + changeX;
        // console.log(translateX);
        // 实时定位
        delTranstition();
        setTranstition(translateX);
    });
    imgObj.addEventListener('touchend', function (e) {
        // 距离
        var distance = Math.abs(changeX);  // 绝对值  单位px
        var time = Date.now() - startTime;   //单位  MS
        //速度 v = s / t
        var v = distance / time;  // 单位 px/ms
        // 速度快 也会包含距离小或者大，因为距离大或小也有可能速度大
        if (v > 0.4){
            // 如果改变大小为正时，也就是向右移动 是索引变小上一张图片
            if (changeX > 0){
                index --;
            }else{
                // 如果改变大小为负时，也就是向左移动 是索引变大下一张图片
                index ++;
            }
            addTranstition();
            setTranstition(-index * width);
        }else{
            if (distance < width / 3){
                // 就会吸附过去  返回原来的位置
                addTranstition();
                setTranstition(-index * width);
            }else{
                // 上一张
                if (changeX > 0){
                    index --;
                }else{
                    index ++;
                }
                addTranstition();
                setTranstition(-index * width);
            }
        }
        autoplay();
    });
});