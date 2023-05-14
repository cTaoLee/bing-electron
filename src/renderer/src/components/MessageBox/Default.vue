<template>
  <div class="default">
    <img :src="bingSvg" alt="" style="width: 56px;height: 56px">
    <h1>欢迎使用新必应</h1>

    <p>选择对话样式</p>
    <div class="items">
      <div class="item" :class="{active: status===0}" @click="handleClick(0)">更<br>有创造力</div>
      <div class="item" :class="{active: status===1}" @click="handleClick(1)">更<br>平衡</div>
      <div class="item" :class="{active: status===2}" @click="handleClick(2)">更<br>精确</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import bingSvg from '@renderer/assets/bing.svg'

const status = ref(1)
const handleClick = (type: number) => {
  status.value = type
  window.electron.ipcRenderer.invoke('changeType', type)
}


</script>

<style scoped>
.default {
  max-width: 310px;
  margin: 0 auto;
  margin-top: 100px;
  text-align: center;
}
p {
  margin-top: 60px;

}
.items {
  width: 306px;
  background: rgba(255, 255, 255, 0.6);
  padding: 3px;
  height: 40px;
  display: flex;
  margin-top: 20px;
  box-shadow:  0 0.3px 0.9px rgba(0, 0, 0, 0.12), 0 1.6px 3.6px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
}
.item {
  width: 33.33%;
  display: flex;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  background: #fff;
  cursor: pointer;
}
.item.active {
  color: #fff;
  background: #0078d7;
  border-radius: 8px;
}
</style>
