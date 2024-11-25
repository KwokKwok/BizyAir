import { defineStore } from 'pinia';
import { getUserInfo } from '@/api/user'
import { WebSocketClient } from '@/utils/socket.ts'
import useClipboard from 'vue-clipboard3'
import { useToaster } from '@/components/modules/toats/index'
const { toClipboard } = useClipboard()
interface UserInfo {
  level: number;
  name: string;
  api_key: string;
  share_id: string;
  last_share_id_update_at: string;
  [key: string]: any;
}
export const useStatusStore = defineStore('userStatus', {
  state: () => ({
    infoData: {} as UserInfo,
    isLogin: false,
    socketMessage: {},
    showApiKeyDialog: false,
  }),
  actions: {
    loginRefresh() {
      getUserInfo().then((info: { data: any; }) => {
        sessionStorage.setItem('userInfo', JSON.stringify(info.data))
        this.infoData = info.data
        this.isLogin = true
      }).catch(() => {
        this.isLogin = false
      })
    },
    sendSocket() {
      // 用户部署环境可能是 http，也可能是 https，所以需要根据实际情况来判断
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsClient = new WebSocketClient(`${protocol}//${location.host}/bizyair/ws?clientId=${sessionStorage.getItem('clientId') || 'dev'}`, []);
      wsClient.onMessage = message => {
          const res = JSON.parse(message.data);
          this.socketMessage = res;
          if (res && res.type === 'errors') {
              console.error(res.data.message)
          }
      }
    },
    handleApiKeyDialog(val: boolean) {
      this.showApiKeyDialog = val
    },
    copyText(text: string) {
      toClipboard(text).then(() => {
        useToaster.success('Copy success')
      }).catch(() => {
        useToaster.error('Copy failed')
      })
    },
  },
});
