<template>
  <div class="page" :style="{backgroundImage: 'url('+wallpaper+')'}">
    <header-box/>
    <div class="main">
      <div class="item">
        <div class="avatar">
          <img :src="userSvg" alt=""/>
        </div>
        <div class="right">
          <div class="name">{{ userInfo.fullName || '未登录' }}</div>
          <div class="email">{{ userInfo.signInName || '点击登录按钮登录' }}</div>
          <div class="link">
            <a v-if="userInfo.fullName" href="">登出</a>
          </div>
        </div>
      </div>

      <button  v-if="userInfo.fullName"  @click="toChat">开始聊天</button>
      <button  v-else  @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeaderBox from '@renderer/components/HeaderBox/index.vue'
// @ts-ignore
import userSvg from '@renderer/assets/user.svg'


const router = useRouter()
const userInfo = ref({fullName: null, signInName: null})


// 获取壁纸
const wallpaper = ref()
// @ts-ignore
window.electron.ipcRenderer.on('wallpaper', (event, data) => {
  wallpaper.value = data
})
// @ts-ignore
window.electron.ipcRenderer.on('userInfo', (event, data) => {
  userInfo.value = data
})

// 跳转到聊天页面
const toChat = () => {
  router.push({ name: 'chat' })
}

const handleLogin = () => {
  window.electron.ipcRenderer.invoke('createLoginWindow')
}
</script>

<style>

.page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0e87a2;
}
.main {
  background: white;
  width: 320px;
  border-radius: 10px;
  padding: 18px;
}
.item {
  display: flex;
  align-items: center;
}
.item .avatar img {
  width: 88px;
  height: 88px;
  border-radius: 40px;
}
.item .right {
  margin-left: 10px;
}
.item .name {
  font-size: 18px;
  font-weight: 700;
}
.item .email {
  margin-top: 3px;
  font-size: 13px;
  font-weight: 700;
}
.item .link {
  margin-top: 3px;
}
.item .link a {
  color: #06c;
  font-size: 13px;
  margin-right: 20px;
  text-decoration: none;
}
button {
  width: 100%;
  height: 40px;
  background-color: #06c;
  color: white;
  border-radius: 5px;
  border: none;
  outline: none;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 700;
}
</style>
