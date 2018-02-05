var Types = require('Types'); // scripts/module/Types.js
var Utils = require('Utils'); // scripts/module/Utils.js
var ActorPlayingState = Types.ActorPlayingState;

cc.Class({
    extends: cc.Component,

    properties: {
        // 所有明牌
        cards: {
            default: [],
            serializable: false,
            visible: false
        },
        // 暗牌，demo 暂存
        holeCard: {
            default: null,
            serializable: false,
            visible: false
        },

        // 手上最接近 21 点的点数（有可能超过 21 点）
        bestPoint: {
            get: function () { // get function
                var minMax = Utils.getMinMaxPoint(this.cards);
                return minMax.max;
            }
        },

        // 牌型，不考虑是否爆牌
        hand: {
            // 对于牌型的逻辑可以写在这里,但是这是可调用的方法还是只是`属性`???
            get: function () {
                var count = this.cards.length;
                if (this.holeCard) {
                    ++count;
                }
                if (count >= 5) { // 五小龙
                    return Types.Hand.FiveCard;
                }
                if (count === 2 && this.bestPoint === 21) { // 黑杰克
                    return Types.Hand.BlackJack; // enum当成属性玩
                }
                return Types.Hand.Normal;
            }
        },

        canReport: {
            // 除了普通牌型之外
            get: function () {
                return this.hand !== Types.Hand.Normal;
            },
            visible: false
        },

        renderer: {
            default: null,
            type: cc.Node
        },
        state: {
            default: ActorPlayingState.Normal,
            // http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html?h=notify
            notify: function (oldState) { 
                if (this.state !== oldState) {
                    this.renderer.updateState(); // 触发指定的方法
                }
            },
            type: ActorPlayingState,
            serializable: false,
        }
    },

    init: function () {
        this.ready = true;
        this.renderer = this.getComponent('ActorRenderer'); // 在init的时候才获得renderer,在state中有使用到
    },

    addCard: function (card) {
        this.cards.push(card);
        this.renderer.onDeal(card, true);

        var cards = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
        if (Utils.isBust(cards)) {
            this.state = ActorPlayingState.Bust;
        }
    },

    addHoleCard: function (card) {
        this.holeCard = card;
        this.renderer.onDeal(card, false);
    },

    stand: function () {
        this.state = ActorPlayingState.Stand;
    },

    revealHoldCard: function () {
        if (this.holeCard) {
            this.cards.unshift(this.holeCard);
            this.holeCard = null;
            this.renderer.onRevealHoldCard();
        }
    },

    // revealNormalCard: function() {
    //     this.onRevealNormalCard();
    // },

    report: function () {
        this.state = ActorPlayingState.Report;
    },

    reset: function () {
        // 手上的卡清空,所有状态重置为初始值
        this.cards = [];
        this.holeCard = null;
        this.reported = false;
        this.state = ActorPlayingState.Normal;
        this.renderer.onReset();
    }
});
