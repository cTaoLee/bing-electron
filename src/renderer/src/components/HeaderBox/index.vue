<template>
  <div class="header">
    <div style="flex:1;-webkit-app-region: drag;background-color: rgba(255, 255, 255, 0.5);"></div>
    <div class="button">
      <div @click="action('min')"><minus-outlined /></div>
      <div v-if="showMax" @click="action('max')"><border-outlined /></div>
      <div class="close" @click="action('close')"><close-outlined /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MinusOutlined, BorderOutlined, CloseOutlined } from '@ant-design/icons-vue'

defineProps({
  showMax: {
    type: Boolean,
    default:  false
  }
})
const action = (type: string) => {
  window.electron.ipcRenderer.invoke('windowAction', type)
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 30px;
  backdrop-filter: blur(4px);
  display: flex;
}
.header .button {
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
}
.header .button  div {
  width: 40px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.header .button  div:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.header .button  div.close:hover {
  background-color: #F86161FF;
  color: white;
}

</style>
