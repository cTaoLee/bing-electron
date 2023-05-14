import axios from 'axios'
import WebSocket from 'ws'
import {getRanHex, randomNum, uuid} from "../utils/tool";


const forwarded_ip = `13.${randomNum(104, 107)}.${randomNum(0, 255)}.${randomNum(0, 255)}`

const headers_1 = {
  "authority": "edgeservices.bing.com",
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "max-age=0",
  "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "Microsoft Edge";v="110"',
  "sec-ch-ua-arch": '"x86"',
  "sec-ch-ua-bitness": '"64"',
  "sec-ch-ua-full-version": '"110.0.1587.69"',
  "sec-ch-ua-full-version-list": '"Chromium";v="110.0.5481.192", "Not A(Brand";v="24.0.0.0", "Microsoft Edge";v="110.0.1587.69"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": '""',
  "sec-ch-ua-platform": '"Windows"',
  "sec-ch-ua-platform-version": '"15.0.0"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.69",
  "x-edge-shopping-flag": "1",
  "x-forwarded-for": forwarded_ip,
}

const headers_2 = {
  "accept": "application/json",
  "accept-language": "en-US,en;q=0.9",
  "content-type": "application/json",
  "sec-ch-ua": '"Not_A Brand";v="99", "Microsoft Edge";v="110", "Chromium";v="110"',
  "sec-ch-ua-arch": '"x86"',
  "sec-ch-ua-bitness": '"64"',
  "sec-ch-ua-full-version": '"109.0.1518.78"',
  "sec-ch-ua-full-version-list": '"Chromium";v="110.0.5481.192", "Not A(Brand";v="24.0.0.0", "Microsoft Edge";v="110.0.1587.69"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": "",
  "sec-ch-ua-platform": '"Windows"',
  "sec-ch-ua-platform-version": '"15.0.0"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-ms-client-request-id": uuid(),
  "x-ms-useragent": "azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32",
  "Referer": "https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx",
  "Referrer-Policy": "origin-when-cross-origin",
  "x-forwarded-for": forwarded_ip,
}

const header_3 = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
  "cache-control": "no-cache",
  "correlation-context": "v=1,ms.b.tel.market=zh-CN",
  "ms-cv": "of7QOqzex0GrRpMJ.8.47",
  "pragma": "no-cache",
  "sec-ch-ua": "\"Microsoft Edge\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-requested-with": "XMLHttpRequest",
}


// 创建一个新的会话
const session = axios.create()
// 为会话加载cookie
export const loadCookie = (cookies: any[]) => {
  session.defaults.headers.common['Cookie'] = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
}
// 获取用户信息
export const getUserInfo = async () => {
  const url = 'https://account.microsoft.com/home/api/profile/personal-info'
  console.log('session get getUserInfo')
  const res = await session.get(url, {headers: header_3})
  return res.data
}

// 创建一个新的 bing 会话
export const createBingSession = async (): Promise<BingSession>  => {
  const bing = new BingSession()
  await bing.reset()
  return bing
}



class BingSession {
  private data;
  private wss;
  private callback;
  private type = 1;
  private status = false;
  private invocationId = 0;

  constructor() {
    this.initWss()
  }

  initWss() {
    this.wss = new WebSocket("wss://sydney.bing.com/sydney/ChatHub", {headers: headers_2, ssl: true,})
    this.wss.on('open', () => {
      console.debug('open');
      this.status = true
      this.sendWssMessage({"protocol": "json", "version": 1}).then()
    });
    this.wss.on('close', () => {
      console.debug('close');
      this.status = false
    })
    this.wss.on('error', (error) => {
      console.debug('error', error);
      this.status = false
    })
    this.wss.on('message', (data: any) => {
      const objects = data.toString().split('');
      const messages = objects.map((object) => {
        try {
          return JSON.parse(object);
        } catch (error) {
          return object;
        }
      }).filter(message => message);

      if (messages.length === 0) {
        return;
      }

      if (typeof messages[0] === 'object' && Object.keys(messages[0]).length === 0) {
        console.debug('handshake established');
        return;
      }
      this.callback(messages);
    })
  }

  getMessage(data: any, prompt: string, options: string[]|null){
    let tone = ""
    if (options === null) {
      switch (this.type) {
        case 0:
          options = [
            "nlu_direct_response_filter",
            "deepleo",
            "disable_emoji_spoken_text",
            "responsible_ai_policy_235",
            "enablemm",
            "h3imaginative",
            "autosave",
            "dagslnv1",
            "enablenewsfc",
            "eiatrvlansgnd",
            "dv3sugg",
            "autosave",
            "clgalileo",
            "gencontentv3"
          ]
          tone = "Creative"
          break
        case 1:
          options = [
            "nlu_direct_response_filter",
            "deepleo",
            "disable_emoji_spoken_text",
            "responsible_ai_policy_235",
            "enablemm",
            "galileo",
            "autosave",
            "dagslnv1",
            "enablenewsfc",
            "eiatrvlansgnd",
            "dv3sugg",
            "autosave",
            "glpromptv6",
            "saharagenconv5"
          ]
          tone = "Balanced"
          break
        case 2:
          options = [
            "nlu_direct_response_filter",
            "deepleo",
            "disable_emoji_spoken_text",
            "responsible_ai_policy_235",
            "enablemm",
            "h3precise",
            "autosave",
            "dagslnv1",
            "enablenewsfc",
            "eiatrvlansgnd",
            "dv3sugg",
            "autosave",
            "clgalileo",
            "gencontentv3"
          ]
          tone = "Precise"
          break
      }
    }
    return {
      "arguments": [
        {
          "source": "cib",
          "optionsSets": options,
          "allowedMessageTypes": [
            "ActionRequest",
            "Chat",
            "Context",
            "InternalSearchQuery",
            "InternalSearchResult",
            "Disengaged",
            "InternalLoaderMessage",
            "Progress",
            "RenderCardRequest",
            "AdsQuery",
            "SemanticSerp",
            "GenerateContentQuery",
            "SearchQuery"
          ],
          "sliceIds": [
            "winmuid1tf",
            "sydconfigoptt",
            "508docxfmts0",
            "ssoverlap0",
            "sswebtop1",
            "dtvoice2cf",
            "threadsonly",
            "adssqovr",
            "winlongmsg2tf",
            "creatorv2c",
            "505iccrics0",
            "505glpv6",
            "505scss0",
            "508jbcar",
            "425bicb2",
            "430rai267s0",
            "507vaop",
            "505bof107s0",
            "424dagslnv1",
            "427startpm",
            "427vserptf1"
          ],
          "verbosity":"verbose",
          "traceId": getRanHex(32),
          "isStartOfSession": this.invocationId === 0,
          "message": {
            "author": "user",
            "inputMethod": "Keyboard",
            "text": prompt,
            "messageType": "Chat",
            "locale":"zh-CN",
            "market":"zh-CN",
            "region":"GB",
            "location":"lat:47.639557;long:-122.128159;re=1000m;",
            "locationHints":[
              {
                "country":"United Kingdom",
                "timezoneoffset":0,
                "countryConfidence":9,
                "Center":{
                  "Latitude":51.5645,
                  "Longitude":-0.2003
                },
                "RegionType":2,
                "SourceType":1
              }
            ],
          },
          "tone": tone,
          "conversationSignature": data.conversationSignature,
          "participant": {
            "id": data.clientId,
          },
          "conversationId": data.conversationId,
        },
      ],
      "invocationId": this.invocationId+"",
      "target": "chat",
      "type": 4,
    }
  }

  async sendWssMessage(message) {
    this.wss.send(JSON.stringify(message)+ "\x1e")
  }

  async sendMessage(message) {
    if (this.status === false) {
      this.initWss()
      await this.reset()
    }

    if (this.data !== undefined) {
      const messageData: any = this.getMessage(this.data, message, null)
      console.log(messageData)
      this.invocationId += 1
      return await this.sendWssMessage(messageData)
    }
  }

  onMessage(callback: (message: any) => void) {
    this.callback = callback
  }

  async reset() {
    this.invocationId = 0
    const url = `http://cloudflare.simemg.com/`
    try {
      console.log('session get reset')
      const res = await session.get(url, {headers: headers_1})
      this.data = res.data
    }
    catch (e) {
      console.log(e)
    }
  }

  changeType(type: any) {
    this.type = type
  }
}

export type {BingSession}
