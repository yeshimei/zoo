<style lang="scss" scoped>
.home {
  height: 100vh;
  overflow: hidden;
  .checker-board {
    display: flex;
    flex-wrap: wrap;
    .item {
      border: 2px solid #f1f1f1;
      border-radius: 10px;
      transition: 0.25s;
      font-size: 35px;
    }

    .item.p1 {
      color: #333;
    }
    .item.p2 {
      color: rgb(189, 90, 25);
    }

    .item.power-card {
      font-weight: 900;
    }

    .item.luck-card {
    }

    .item.reverse {
      background: #999 !important;
    }

    .item.selected {
      box-shadow: 4px -4px 6px -4px, -4px 4px 6px -4px;
      transform: rotateZ(5deg);
      z-index: 99;
    }

    .item.grid {
      background: #fff !important;
    }
  }

  .dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #eee;
    margin-top: 35px;
    text-align: center;
  }

  .dot.active {
    background: rgb(77, 167, 50);
  }

  .player-bar-panel {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    text-align: center;
    margin-top: 50px;

    .avatar {
      align-self: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #eee;
      transition: 0.25s;
    }

    .avatar.active {
      background: rgb(46, 212, 41);
    }

    .username {
      margin-top: 20px;
      font-size: 35px;
    }
  }

  .player-bar-panel.p1 {
    .avatar {
      background: #333;
    }

    .username {
      color: #333;
    }
  }

  .player-bar-panel.p2 {
    .avatar {
      background: rgb(189, 90, 25);
    }

    .username {
      color: rgb(189, 90, 25);
    }
  }

  .give-up,
  .next {
    margin-top: 100px;
    text-align: center;
    font-size: 35px;
    padding: 15px 0;
    border-radius: 15px;
    color: #aaa;
    border: 2px solid;
  }

  .next {
    margin-top: 0;
  }

  .give-up.active,
  .next.active {
    color: #333;
  }

  .give-up-confirm {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99;

    .wrapper {
      position: absolute;
      top: 50px;
      width: 80vw;
      padding: 25px 35px;
      border-radius: 15px;
      left: 50%;
      transform: translateX(-50%);
      background: #f5f5f5;
      font-size: 30px;
    }
    .agree,
    .refuse {
      display: inline-block;
      border-radius: 5px;
      padding: 5px 15px;
      color: rgb(66, 168, 72);
      margin-top: 25px;
      border: 1px solid;
    }

    .refuse {
      color: rgb(168, 58, 58);
      margin-left: 15px;
    }
  }

  .log {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 35px;
    color: #eee;
  }
}
.wait-player,
.watch {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 45px;
  width: 100vw;
  text-align: center;
}

.watch {
  top: 75%;
}
</style>
<template>
  <div class="home" v-if="players.length > 1">
    <div class="checker-board" v-if="grids.length">
      <div
        class="item"
        v-for="(grid, i) of grids"
        :key="i"
        :class="cardStyles(grid.card)"
        :style="{ width: w + 'px', height: w + 'px' }"
        @click="action(grid)"
      >
        <div class="item-card" v-show="grid.card.reverse">
          {{ grid.card.name }} {{ grid.card.power && `(${grid.card.power})` }}
        </div>
      </div>
    </div>

    <div class="player-bar-panel" :class="playerBarStyles">
      <div class="avatar"></div>
      <div class="username">
        {{ currentPlayer.id === userData.id ? '我' : currentPlayer.username }}
      </div>
    </div>

    <div class="funcs" v-if="self.camp !== -1">
      <div
        class="give-up"
        :class="{ active: currentPlayer.id === userData.id }"
        @click="onGiveUp"
        v-if="giveUp || giveUp.id === userData.id"
      >
        {{ giveUp.id === userData.id ? '等待对方确认' : '认输' }}
      </div>

      <div
        class="next"
        @click="$send('next')"
        :class="{ active: currentPlayer.id === userData.id }"
      >
        跳过
      </div>
    </div>

    <div v-else class="watch">正在观战</div>

    <transition name="slideDown">
      <div
        class="give-up-confirm"
        v-if="giveUp.id && giveUp.id !== userData.id"
      >
        <div class="wrapper">
          <div class="text">{{ giveUp.username }} 请求认输</div>
          <div class="agree" @click="onConfirmGiveUp(true)">√ 同意</div>
          <div class="refuse" @click="onConfirmGiveUp(false)">× 拒绝</div>
        </div>
      </div>
    </transition>

    <!-- <div class="log" @click="isLogPlane = true">- DEVELOPER LOG -</div>

    <LogPlane :show="isLogPlane" @back="() => (isLogPlane = false)"> </LogPlane> -->
  </div>

  <div class="wait-player" v-else>等待一名玩家加入游戏</div>
</template>

<script>
import { mapState } from 'vuex'
// import LogPlane from '@/components/LogPlane.vue'

export default {
  name: 'HomeView',
  data() {
    return {
      w: 0,
      isLogPlane: false,
      selectedGrid: null,
      isMsg: true
    }
  },
  computed: {
    ...mapState([
      'checkerBoard',
      'players',
      'grids',
      'currentPlayer',
      'userData',
      'giveUp',
      'toCard'
    ]),

    playerBarStyles() {
      return {
        p1: this.currentPlayer.camp,
        p2: !this.currentPlayer.camp
      }
    },

    self() {
      return this.players.find(player => player.id === this.userData.id)
    }
  },

  methods: {
    play() {
      this.$send('play')
    },
    onGiveUp() {
      this.$send('give up')
    },
    onConfirmGiveUp(b) {
      this.$send('confirm give up', b)
    },
    action(grid) {
      if (grid.card.reverse || !grid.card.id) {
        if (this.selectedGrid) {
          if (this.selectedGrid.id === grid.id) {
            // 取消选中
            this.selectedGrid = null
          } else {
            if (
              grid.card.type === 'zoo' &&
              grid.card.camp === this.currentPlayer.camp
            ) {
              this.selectedGrid = grid
            } else {
              // action
              this.$send('action', this.selectedGrid.id, grid.id)
              this.selectedGrid = null
            }
          }
        } else {
          // 选中,仅允许选中自己的卡牌和 zoo
          if (
            this.currentPlayer.camp === grid.card.camp &&
            grid.card.type === 'zoo'
          ) {
            this.selectedGrid = grid
          }
        }
      } else {
        // 反面
        if (!this.selectedGrid) this.$send('reverse', grid.id)
      }
    },
    cardStyles(card) {
      return {
        p1: card.camp,
        p2: !card.camp,
        'power-card': card.type === 'power',
        reverse: !card.reverse,
        selected:
          (this.selectedGrid &&
            this.selectedGrid.card.id === card.id &&
            this.currentPlayer.id === this.userData.id) ||
          card.id === this.toCard,
        grid: !card.id
      }
    }
  },
  watch: {
    'checkerBoard.round'() {
      this.selectedGrid = null
    },
    selectedGrid(value) {
      if (this.currentPlayer.id === this.userData.id) {
        this.$send('selected card', value ? value.card.id : null)
      }
    }
  },
  created() {
    this.w = innerWidth / this.checkerBoard.col
  }
  // components: { LogPlane }
}
</script>
