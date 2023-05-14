<template>
  <div class="page">
    <header-box :show-max="true" />

    <div class="content">
      <message-box ref="messageBox"  />

      <div class="suggestion"></div>

      <div class="form">
        <div class="clear-set" @click="clearSet" >
          <img :src="clearSvg" style="width: 32px;height:32px;margin-top:8px;margin-left: 8px;"/>
          <div class="tip">新主题</div>
        </div>
        <div class="input-box" :class="{focus: typingStatus}">
          <div class="icon-chat">
            <img :src="chatSvg" class="svg"/>
          </div>
          <div class="input">
            <a-textarea class="textarea"
                        v-model:value="message"
                        :auto-size="{minRows: 1, maxRows: 4}"
                        placeholder="有问题尽管问我..."
                        @focus="handleInputFocus"
                        @focusout="handleInputFocusout"
                        @keydown="Keydown" />
          </div>
          <div class="icon-send" @click="handleSend">
            <img :src="sendSvg" alt="" class="svg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import HeaderBox from '@renderer/components/HeaderBox/index.vue'
import MessageBox from '@renderer/components/MessageBox/index.vue'
// @ts-ignore
import clearSvg from '@renderer/assets/clear.svg'
// @ts-ignore
import chatSvg from '@renderer/assets/chat.svg'
// @ts-ignore
import sendSvg from '@renderer/assets/send.svg'

import { Textarea as ATextarea } from 'ant-design-vue'


const typingStatus = ref(false)

const messageBox = ref()

window.electron.ipcRenderer.invoke('startChat')
// @ts-ignore
window.electron.ipcRenderer.on('receiveMessage', (event: any, messages: any[]) => {
  messageBox.value.receiveMessage(messages)
})




const message = ref('')
const handleSend = () => {
  messageBox.value.receiveMessage(message.value)
  setTimeout(() => {message.value = ''},5)
  window.electron.ipcRenderer.invoke('sendMessage', message.value)
}

const Keydown = (e) => {
  if (!e.shiftKey && e.keyCode == 13) {
    e.preventDefault();
    //以下处理发送消息代码
    handleSend()
  }
}


const handleInputFocus = () => {
  typingStatus.value = true
}
const handleInputFocusout = () => {
  if (message.value === '')
    typingStatus.value = false
}

const clearSet = () => {
  messageBox.value.cleanMessage()
  window.electron.ipcRenderer.invoke('resetChat')
}



</script>

<style scoped>
.page {
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: radial-gradient(61.04% 89.69% at 100% 100%, rgba(200, 250, 255, 0.08) 0%, rgba(28, 210, 229, 0.08) 40.63%, rgba(28, 210, 229, 0) 100%),
    radial-gradient(43.78% 64.34% at 60.31% 100%, rgba(23, 74, 228, 0.08) 0%, rgba(23, 74, 228, 0) 100%),
    linear-gradient(180deg, rgba(23, 74, 228, 0) 29.44%, rgba(23, 74, 228, 0.06) 100%),
    linear-gradient(90deg, #F3F3F7 0%, #EBF0F9 100%);
}
.content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.data {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  margin-top: 30px;
  padding-bottom: 20px;
}
.data::-webkit-scrollbar {
  width: 0;
}
.suggestion {
  width: 100%;
  height: 32px;
  padding: 16px 24px;
  box-sizing: border-box;
}
.form {
  display: flex;
  min-height: 100px;
}
.clear-set {
  position: relative;
  height: 48px;
  width: 48px;
  background: #1d4eef;
  border-radius: 24px;
  margin-right: 20px;
  cursor: pointer;
  transition: all 0.5s;
  overflow: hidden;
}
.clear-set:hover {
  width: 116px;
}
.clear-set .icon {
  height: 32px;
  width: 32px;
  position: absolute;
  top: 8px;
  left: 8px;
}


.clear-set .tip {
  position: absolute;
  width: 68px;
  left: 48px;
  top: 12px;
  color: #fff;
  font-size: 17px;
}

.input-box {
  flex: 1;
  height: 50px;
  display: flex;
  background: #fff;
  box-sizing: border-box;
  padding: 8px;
  border-radius: 24px;
  box-shadow: rgba(0,0,0,0.12) 0 0.3px 0.9px 0, rgba(0,0,0,0.16) 0 1.6px 3.6px 0;
  transition: all 0.5s;
  overflow: hidden;
}
.input-box.focus {
  height: 100px;
}
.input-box .icon-chat {
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-chat .svg {
  height: 20px;
  width: 20px;
}
.input {
  flex: 1;
}
.input input:focus {
  outline: none;
}
.input textarea {
  border:0;
  margin-top: 8px;
  font-size: 16px;
  outline: none;
  resize: none;
  width: 100%;
}
.icon-send {
  cursor: pointer;
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-send .svg {
  height: 20px;
  width: 20px;
}
</style>
