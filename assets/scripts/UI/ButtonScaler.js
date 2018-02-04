// 代码文件夹为UI
// 表示只是和ui相关的操作与动作,与实际逻辑分离


// 按钮只负责按钮的事情
// 按钮的职责包括touchstart, touchend, touchcancel
// 和相应的动画效果

// 播放音乐等操作,调用其他脚本完成

cc.Class({
    extends: cc.Component,

    properties: {
        pressedScale: 1,
        transDuration: 0
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        var audioMng = cc.find('Menu/AudioMng') || cc.find('Game/AudioMng') // 场景中的Menu/AudioMng
        if (audioMng) {
            audioMng = audioMng.getComponent('AudioMng');
        }
        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);
        function onTouchDown (event) {
            this.stopAllActions();
            if (audioMng) audioMng.playButton();
            this.runAction(self.scaleDownAction);
        }
        function onTouchUp (event) {
            this.stopAllActions();
            // 为什么这里没有停止音乐的操作呢???
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
});
