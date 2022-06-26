<style lang="scss" scoped>
.log-plane {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;

  .wrapper {
    position: absolute;
    left: 50%;
    top: 20%;
    height: 85vh;
    transform: translateX(-50%);
    width: 85vw;
    padding-bottom: 100px;
    border-radius: 25px;
    background: #f5f5f5;
    overflow: scroll;
    text-align: center;
    .tabs {
      position: relative;
      margin-top: 80px;
    }
    .type {
      font-size: 45px;
    }

    .log {
      text-align: left;
      padding: 0 35px;

      .date {
        margin-left: 25px;
        margin-top: 35px;
        font-size: 30px;
      }

      .content {
        margin-top: 25px;
      }

      .text {
        margin-top: 10px;
      }
    }
  }
}
</style>

<template>
  <transition name="slideUp">
    <div class="log-plane" @click.self="$emit('back')" v-if="show">
      <div class="wrapper">
        <div class="tabs">
          <div class="type">教程</div>
          <div class="log" v-for="(content, i) of log.course" :key="i">
            <div class="date">{{ content.date }}</div>
            <div class="content">
              <div class="text" v-for="(text, j) of content.content" :key="j">{{ j + 1 }}. {{ text }}</div>
            </div>
          </div>
        </div>
        <div class="tabs">
          <div class="type">更新日志</div>
          <div class="log" v-for="(content, i) of log.update" :key="i">
            <div class="date">{{ content.date }}</div>
            <div class="content">
              <div class="text" v-for="(text, j) of content.content" :key="j">{{ j + 1 }}. {{ text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LogPlane',
  data() {
    return {
      type: 'course'
    }
  },
  props: ['show'],

  methods: {
    replaceTypeText(type) {
      return {
        update: '更新日志',
        course: '教程'
      }[type]
    }
  },

  computed: {
    ...mapState(['log'])
  }
}
</script>
