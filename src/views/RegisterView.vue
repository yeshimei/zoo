<style scoped>
#register {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
  width: 100vw;
  height: 100vh;
}

.wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

input {
  border: none;
  width: 600px;
  height: 80px;
  border-radius: 15px;
  background: #eee;
  color: #888;
  text-align: center;
  outline: none;
  transition: 0.25s;
}

input.error {
  background: rgba(136, 136, 136, 0.511);
  color: #fff;
}

button {
  position: absolute;
  width: 600px;
  height: 80px;
  left: 0;
  bottom: 0;
  border: none;
  border-radius: 20px;
  z-index: -1;
  transition: 0.25s;
  color: #666;
  outline: none;
}

button.down {
  bottom: -100px;
}
</style>

<template>
  <div id="register">
    <div class="wrapper">
      <input
        :class="{ error: userData.username.length > 8 }"
        type="text"
        placeholder="输入您的昵称"
        v-model="userData.username"
        @click.capture.stop.prevent="$event.target.focus()"
      />
      <button @click="onSubmit()" :class="{ down: userData.username }">
        {{ userData.username.length > 8 ? '这么多字，你能记住吗' : '冲冲冲！' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      maxlength: 8,
      userData: {
        username: '',
        score: 0
      }
    }
  },

  methods: {
    onSubmit() {
      if (this.userData.username && this.userData.username.length <= 8) {
        this.userData.id = Math.random().toString(16).slice(2)
        localStorage.setItem('__userData__', JSON.stringify(this.userData))
        this.$router.push('/')
      }
    }
  },

  created() {
    let userData = JSON.parse(localStorage.getItem('__userData__'))
    if (userData) this.userData = userData
  }
}
</script>
