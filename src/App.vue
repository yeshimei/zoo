<template>
  <router-view />
</template>

<style lang="scss">
body {
  overflow: hidden;
  user-select: none;
  font-family: Inter, Roboto, Oxygen, Fira Sans, Helvetica Neue,
    sans-serifOpen Sans, Inter, Roboto, Oxygen, Fira Sans, Helvetica Neue,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #666;
  font-size: 24px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

._flex-push {
  margin-left: auto;
}

._gap > *:not(:last-child) {
  margin-right: 10px;
}

._gapc > *:not(:last-child) {
  margin-bottom: 10px;
}

.slideDown-enter-active,
.slideDown-leave-active {
  transition: 0.5s;
}
.slideDown-enter-from,
.slideDown-leave-to {
  transform: translateY(-100%);
}

.slideUp-enter-active,
.slideUp-leave-active {
  transition: 0.5s;
}
.slideUp-enter-from,
.slideUp-leave-to {
  transform: translateY(100%);
}
</style>

<script></script>
