<template>
    <div class="message-main" ref="main">
        <default></default>
        <div v-for="item in list">
            <div class="search" v-if="item.type === 'search'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" fill="#13A10E" class="search-icon">
                    <path d="M256 1088q0-26 19-45t45-19q26 0 45 19l403 402 915-914q19-19 45-19t45 19 19 45q0 26-19 45l-960 960q-19 19-45 19t-45-19l-448-448q-19-19-19-45z"></path>
                </svg>
                <div class="message">{{ item.text }}</div>
            </div>

            <div class="bot" v-if="item.type === 'bot'">
                <div class="message-box shadow">
                    <div class="message markdown-body" v-html="item.text"></div>
                    <div class="more" v-if="item.more.length > 0">
                        <div>了解详细信息：</div>
                        <div class="links">
                          <a class="tag" :style="{ width: (100/item.more.length)+'%' }" :href="link.seeMoreUrl" target="_blank"  v-for="link in item.more"> {{ getDomain(link.seeMoreUrl) }}</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="image" v-if="item.type === 'image'">
              <iframe class="frame" role="presentation" style="width:475px;height:520px;" :src="item.url">
              </iframe>
            </div>

            <div class="user" v-if="item.type === 'user'">
                <div class="message-box">
                    <div class="message" v-html="item.text"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import {getDomain} from '@renderer/utils/tools'
import Default from '@renderer/components/MessageBox/Default.vue'

const list = ref<any[]>([])
const main = ref()
let messageIds: any[] = []
let messageData: any[] = []

function highlightBlock(str: string, lang?: string) {
    return `<pre class="code-block-wrapper"><div class="code-block-header"><a id="" class="code-block-header__copy">复制</a></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

// 处理 bing 返回的消息
const handleMessage = (data: any) => {
    if (data.messageType === 'InternalSearchQuery') {
        return {
            type: 'search',
            text: data.spokenText
        }
    }
    if (data.messageType === 'InternalSearchResult' || data.messageType === 'InternalLoaderMessage' || data.messageType === 'RenderCardRequest') {
        return {
            type: 'null',
            text: data.hiddenText
        }
    }
    if (data.messageType === 'GenerateContentQuery' && data.contentType === 'IMAGE') {
        return {
            type: 'image',
            url: `https://www.bing.com/images/create?partner=sydney&re=1&showselective=1&sude=1&kseed=10000&SFX=7&q=${data.text}&iframeid=${data.messageId}`
        }
    }
    const mdi = new MarkdownIt({
        html: true,
        linkify: true,
        highlight(code, language) {
            const validLang = !!(language && hljs.getLanguage(language))
            if (validLang) {
                const lang = language ?? ''
                return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
            }
            return highlightBlock(hljs.highlightAuto(code).value, '')
        },
    })
    mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
    mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })
    let message = data.adaptiveCards[0].body[0].text ||  data.text
    message = message.replace(/\^(\d+)\^/g, '<sup>$1</sup>')
    return {
        type: 'bot',
        text: mdi.render(message),
        more: data.sourceAttributions
    }
}

// 接收到消息
const receiveMessage = (messages: any) => {
    console.log(messages)
    // 判断 messages 是不是 bing 返回的
    if (messages instanceof Array) {
        messages.forEach((message) => {
            if (message.type === 2) return ;
            if (message.type === 6) return ;
            const item: any = message?.arguments[0]?.messages[0]
            if (messageIds.indexOf(item.messageId) === -1) {
                messageIds.push(item.messageId)
                messageData.push(handleMessage(item))
            }
            else {
                messageData[messageIds.indexOf(item.messageId)] = handleMessage(item)
            }
        })
    }
    // 处理用户发送过来的消息
    else {
        messageIds.push(1)
        messageData.push({type: 'user', text: messages})
    }
    list.value = [...messageData]

    // 滚动到底部
    setTimeout(() => {
        main.value.scrollTop = main.value.scrollHeight
    }, 10)
}

const cleanMessage = () => {
    list.value = []
    messageIds = []
    messageData = []
}



defineExpose({
    receiveMessage,
    cleanMessage
})
</script>


<style lang="less">
@import "highlight";
</style>

<style lang="less" scoped>
.message-main {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    margin-top: 30px;
    padding-bottom: 20px;
}
.message-main::-webkit-scrollbar {
    width: 0;
}
.change {
  text-align: center;
  .title {

  }
  .item {
    display: flex;
    align-items: center;
    margin: 12px 0;
    .message-box {
      max-width: 80%;
      background-color: rgba(255,255,255,0.6);
    }
    .more {
      border-top: 1px solid rgba(0,0,0,0.1);
      padding: 8px 0;
      display: flex;
      .links {
        flex:1;
        a {
          margin-left: 8px;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.message-main {
    display: flex;
    flex-direction: column;

    // 文本格式
    .message-box {
        display: inline-block;
        border-radius: 12px;
        .message {
            line-height: 22px;
            padding: 16px;
        }

        .more {
          display: flex;
          .links {
            flex:1;
            a {
              margin-left: 8px;
              text-overflow: ellipsis;
            }
          }
        }
    }

}

// 搜索
.search {
    display: flex;
    align-items: center;
    .search-icon {
        width: 30px;
        height: 30px;
        color: #0066cc;
    }
}

// 机器人
.bot {
    margin: 12px 0;
    .message-box {
        max-width: 80%;
        background-color: rgba(255,255,255,0.6);
    }
    .more {
        border-top: 1px solid #e5e5e5;
        padding: 16px;
        font-size: 14px;
        display: flex;
        .links {
          flex: 1
        }

        .tag {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
    }
}

// 用户
.user {
    margin: 12px 0;
    text-align: right;
    .message-box {
        text-align: left;
        max-width: 80%;
        color: white;
        background: linear-gradient(90deg, #2870EA 10.79%, #1B4AEF 87.08%);
    }
}

</style>
