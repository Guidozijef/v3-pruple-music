import { defineStore } from "pinia";
import { getHistoryList, setHistoryList } from "../utils";
import request from "@/request";
// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useMusicStore = defineStore("music", {
  // other options...
  state: () => ({
    audioEle: null, // audio元素
    songPlayUrl: "", // 当前播放的链接地址
    songPlayLrc: [], // 当前歌词
    currentTime: 0, // 当前已播放的时间
    importUserInfo: JSON.parse(localStorage.getItem("WYSELFLIST") as string) || [], // 存储导入的歌单
    prevPlayInfo: {}, // 当前播放的歌单信息
    prevPlayList: [], // 当前播放的歌曲列表
    prevPlaySong: {}, // 当前播放的歌曲信息
    wangyiyun: {
      hottest: {},
      hot: {}, // 最热歌单
      boutique: {}, // 精品歌单
    },
    qq: {
      allData: {}, // 全部qq音乐数据
      hottest: {},
      hot: {}, // 最热歌单
      boutique: {}, // 精品歌单
    },
    historyList: getHistoryList() || [],
  }),
  getters: {
    wy_HottestSongList(state) {
      return state.wangyiyun.hottest;
    },
    wy_HotSongList(state) {
      return state.wangyiyun.hot;
    },
    wy_BoutiqueSongList(state) {
      return state.wangyiyun.boutique;
    },
    qq_HottestSongList(state) {
      return state.qq.hottest;
    },
    qq_allDataList(state) {
      return state.qq.allData;
    },
    qq_HotSongList(state) {
      return state.qq.hot;
    },
    qq_BoutiqueSongList(state) {
      return state.qq.boutique;
    },
    // historyList(state) {
    //   return state.historyList;
    // },
  },
  actions: {
    // 修改audio元素
    setAudioEle(audioEle: Element | any) {
      this.audioEle = audioEle;
    },
    // 播放链接地址
    setSongPlayUrl(songPlayUrl: string) {
      this.songPlayUrl = songPlayUrl;
    },
    // 播放的歌词
    setSongPlayLrc(songPlayLrc: string) {
      // this.songPlayLrc = songPlayLrc;
      if (songPlayLrc === "") return "";
      const lyrics = songPlayLrc.split("\n");
      const lrcList = [];
      for (let i = 0; i < lyrics.length; i++) {
        const lyric = decodeURIComponent(lyrics[i]);
        const timeReg = /\[\d*:\d*((\.|:)\d*)*\]/g;
        const timeRegExpArr = lyric.match(timeReg);
        if (!timeRegExpArr) continue;
        const clause = lyric.replace(timeReg, "");
        for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
          const t = timeRegExpArr[k];
          const min = Number(String(t.match(/\[\d*/i)).slice(1));
          const sec = Number(String(t.match(/:\d*/i)).slice(1));
          const times = min * 60 + sec;
          lrcList.push({ times: times, clause: clause });
        }
      }
      this.songPlayLrc = lrcList;
    },
    // 当前播放的时间
    setCurrentTime(currentTime: number) {
      this.currentTime = currentTime;
    },
    // 网易云最热歌单
    set_WY_HottestSongList(wyHottestSongList: any[]) {
      this.wangyiyun.hottest = wyHottestSongList;
    },
    // 网易云最热歌单
    set_WY_HotSongList(wyHotSongList: any[]) {
      this.wangyiyun.hot = wyHotSongList;
    },
    // 网易云最热歌单
    set_WY_BoutiqueSongList(wyBoutiqueSongList: any[]) {
      this.wangyiyun.boutique = wyBoutiqueSongList;
    },
    // QQ全部数据
    set_QQ_allDataList(qqAllDataList: any[]) {
      this.qq.allData = qqAllDataList;
    },
    // QQ最热歌单
    set_QQ_HottestSongList(qqHottestSongList: any[]) {
      this.qq.hottest = qqHottestSongList;
    },
    // QQ最热歌单
    set_QQ_HotSongList(qqHotSongList: any[]) {
      this.qq.hot = qqHotSongList;
    },
    // QQ最热歌单
    set_QQ_BoutiqueSongList(qqBoutiqueSongList: any[]) {
      this.qq.boutique = qqBoutiqueSongList;
    },
    // 修改audio元素
    setImportUserInfo(importUserInfo: never[]) {
      this.importUserInfo = importUserInfo;
    },
    // 当前播放列表
    setPrevPlayList(prevPlayList: never[]) {
      this.prevPlayList = prevPlayList;
    },
    // 设置当前歌单信息
    setPrevPlayInfo(prevPlayInfo: object) {
      this.prevPlayInfo = prevPlayInfo;
    },
    // 设置当前歌曲信息
    setPrevPlaySong(prevPlaySong: object) {
      this.prevPlaySong = prevPlaySong;
    },
    // 历史记录数据
    setHistory(music: object) {
      this.historyList = setHistoryList(music);
      // this.historyList = historyList;
    },
    // 获取音乐播放地址
    async getSongPlayUrl(songId: number) {
      const { code, data } = await request.get(`/song/url/v1?id=${songId}&level=exhigh`); // level: 播放音质等级, 分为 standard => 标准,higher => 较高, exhigh=>极高, lossless=>无损, hires=>Hi-Res
      if (code === 200) {
        this.setSongPlayUrl(data[0].url);
      }
    },
    // 获取音乐歌词
    async getSongLyric(songId: number) {
      const { code, lrc } = await request.get(`/lyric?id=${songId}`);
      if (code === 200) {
        this.setSongPlayLrc(lrc.lyric);
      }
    },
  },
});
