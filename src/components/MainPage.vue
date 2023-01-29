<template>
  <div class="main-page">
    <audio id="audio" ref="audio" autoplay :src="songPlayUrl" :loop="state.loop" @canplay="getDuration" @timeupdate="updateTime"></audio>
    <div class="menu">
      <ul class="menu-icon-list">
        <li class="iconFontItem">
          <span class="iconfont icon-fanhui" @click="goBack()"></span>
        </li>
        <li class="iconFontItem" @click="goHome()">
          <span class="iconfont icon-zhuye"></span>
          <a herf>首页</a>
        </li>
        <li class="iconFontItem" @click="goSlef()">
          <span class="iconfont icon-gengduo"></span>
          <a herf>Slef</a>
        </li>
        <li class="iconFontItem">
          <span class="iconfont icon-yinlehe" style="font-size: 27px" @click="goMusicBox()"></span>
          <a herf>音乐盒</a>
        </li>
        <li class="iconFontItem">
          <span class="iconfont icon-FMxia-copy" style="font-size: 25px" @click="goQieFM()"></span>
          <a herf>企鹅FM</a>
        </li>
        <li class="iconFontItem">
          <span class="iconfont icon-music_active"></span>
          <a herf>历史</a>
        </li>
      </ul>
    </div>
    <div class="main-container">
      <div class="heades">
        <input v-model="state.seachValue" type="text" class="input" placeholder="在库中搜索" @keyup.enter="goSeach(state.seachValue)" />
        <span class="iconfont icon-sousuo1" @click="goSeach(state.seachValue)"></span>
      </div>
      <div class="musicControl">
        <ul class="iconControl">
          <li class="itemControl" @click="prev()">
            <span class="iconfont icon-shangyishou"></span>
            <span class="itemBorder"></span>
          </li>
          <li class="itemControl" @click="play()">
            <span
              class="iconfont"
              :class="{
                'icon-bofang': !state.playing,
                'icon-zanting': state.playing,
              }"
            ></span>
            <span class="itemBorder"></span>
          </li>
          <li class="itemControl" @click="next()">
            <span class="iconfont icon-shangyishou1"></span>
            <span class="itemBorder"></span>
          </li>
          <li class="itemControl" @click="state.target = false">
            <span v-show="state.target" class="iconfont icon-laba" style="font-size: 22px"></span>
            <span v-show="state.target" class="itemBorder"></span>
          </li>
          <div v-show="!state.target" class="volume-slider">
            <!-- <mu-slider v-model="state.volume" :display-value="false" color="#9530a3" @change="changeVolume"></mu-slider> -->
            <input style="width: 100%" type="range" v-model="state.volume" @change="changeVolume" />
          </div>
          <li class="itemControl">
            <span
              class="iconfont"
              :class="state.sequence ? 'icon-bofangye-caozuolan-suijibofang' : 'icon-xunhuanbofang'"
              @click="state.sequence = !state.sequence"
            ></span>
            <!-- <span class="iconfont icon-bofangye-caozuolan-suijibofang"></span> -->
            <span class="itemBorder"></span>
          </li>
          <li class="itemControl">
            <span
              class="iconfont icon-danquxunhuan"
              :style="{ color: state.loop ? '#fff' : '#000' }"
              style="font-size: 22px"
              @click="state.loop = !state.loop"
            ></span>
            <span
              class="itemBorder"
              :style="{
                backgroundColor: state.loop ? '#9530a3' : null,
                display: state.loop ? 'inline-block' : 'none',
              }"
            ></span>
          </li>
        </ul>
        <div class="musicSilder">
          <!-- <mu-slider class="demo-slider" :display-value="false" :value="playTime" color="#9530a3" @change="changePlayTime"></mu-slider> -->
          <!-- <el-slider v-model="this.playTime"></el-slider> -->
          <input style="width: 100%" type="range" v-model="playTime" @change="changePlayTime" />
        </div>
        <div class="musicBarTime">{{ format(currentTime) }}/{{ format(state.duration % 3600) }}</div>
        <div class="minBox" v-if="prevPlaySong.al" @click="goShowSonging()">
          <div class="minImg">
            <img :src="prevPlaySong.al.picUrl" alt srcset />
          </div>
          <div class="infoBox">
            <span class="prevsonger">{{ prevPlaySong.name }}</span>
            <span class="prevName">{{ prevPlaySong.ar[0].name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useMusicStore } from "../stores/music";

const musicStore = useMusicStore();
// let { setAudioEle } = storeToRefs(musicStore);

const router = useRouter();

let state = reactive({
  sequence: false, // 是否乱序播放
  loop: false, // 是否循环
  lyric: [],
  volume: 30,
  target: true,
  playing: false,
  duration: 0,
  seachValue: "",
});

let audio = ref();

const songPlayUrl = computed(() => musicStore.songPlayUrl);
const currentTime = computed(() => musicStore.currentTime);
const prevPlaySong = computed(() => musicStore.prevPlaySong);
const prevPlayList = computed(() => musicStore.prevPlayList);
const historyList = computed(() => musicStore.historyList);
const playTime = computed({
  get() {
    return currentTime.value * (100 / state.duration); //将当前时间转换为进度条显示
  },
  set(val) {
    console.log(val, state.duration);
    const currTime = (val * state.duration) / 100;
    musicStore.setCurrentTime(currTime);
    audio.value.currentTime = currTime.toFixed(3);
  },
});

const format = (value: number): string => {
  let minute = Math.floor(value / 60) + "";
  let second = Math.floor(value % 60) + "";
  return `${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
};

const changePlayTime = (val: number) => {
  audio.value.currentTime = (val * state.duration) / 100; // 设置从什么时候开始播放
  musicStore.setCurrentTime((val * state.duration) / 100); //获取audio当前播放时间
};
// 去首页
const goHome = () => {
  router.push({ name: "homePage" });
};
// 返回
const goBack = () => {
  router.go(-1);
};
// 去自己的页面
const goSlef = () => {
  router.push({ name: "self" });
};
// 去音乐盒
const goMusicBox = () => {
  router.push({ name: "musicBox" });
};
// 去企鹅FM
const goQieFM = () => {
  router.push({ name: "qieFM" });
};
// 获取当前播放的时间
const updateTime = (e: any) => {
  musicStore.setCurrentTime(e.target.currentTime); //获取audio当前播放时间
};
// 获取总时长
const getDuration = () => {
  // console.log(audio.value.duration); //此时可以获取到duration
  state.duration = audio.value.duration; // 总共时长
};
// 去到歌词的页面
const goShowSonging = () => {
  router.push({ name: "showSonging" });
};
// 搜索
const goSeach = (seachValue: string) => {
  state.seachValue ? router.push({ name: "seach", params: { seachValue } }) : null;
};
// 点击播放
const play = () => {
  state.playing = audio.value.paused; // 播放器的状态
  state.playing ? audio.value.play() : audio.value.pause();
};
// 上一首
const prev = () => {
  let prevPlayId = prevPlaySong.value.id;
  prevPlayList.value.forEach((item, index) => {
    if (prevPlayId == item.id) {
      let prevItem = index <= 0 ? item : prevPlayList.value[index - 1];
      musicStore.setPrevPlaySong(prevItem);
      musicStore.getSongPlayUrl(prevItem.id);
      musicStore.getSongLyric(prevItem.id);
    }
  });
};

// 下一首
const next = () => {
  var prevPlayId = prevPlaySong.value.id;
  if (prevPlayList.value.length) {
    prevPlayList.value.forEach((item, index) => {
      if (prevPlayId == item.id) {
        const nextItem = index >= prevPlayList.value.length - 1 ? item : prevPlayList.value[index + 1];
        musicStore.setPrevPlaySong(nextItem);
        musicStore.getSongPlayUrl(nextItem.id);
        musicStore.getSongLyric(nextItem.id);
      }
    });
  }
};

// 按键事件
const initKeyDown = () => {
  document.onkeydown = (e) => {
    switch (e.ctrlKey && e.keyCode) {
      // case 13: // 回车
      //   this.$refs.input.focus(function() {
      //     console.log("adfgdsf");
      //     this.goSeach(this.seachValue);
      //   });
      //   break;
      case 32: // 播放暂停Ctrl + Space
        play();
        break;
      case 37: // 上一曲Ctrl + Left
        prev();
        break;
      case 38: // 音量加Ctrl + Up
        // let plus = Number((audio.value.volume += 0.1).toFixed(1));
        // eslint-disable-next-line no-case-declarations
        let plus = 2;
        if (plus > 1) {
          plus = 1;
        }
        changeVolume(plus);
        break;
      case 39: // 下一曲Ctrl + Right
        next();
        break;
      case 40: // 音量减Ctrl + Down
        // let reduce = Number((audio.value.volume -= 0.1).toFixed(1));
        // eslint-disable-next-line no-case-declarations
        let reduce = 2;
        if (reduce < 0) {
          reduce = 0;
        }
        changeVolume(reduce);
        break;
      case 79: // 切换播放模式Ctrl + O
        modeChange();
        break;
    }
  };
};
const changeVolume = () => {
  audio.value.volume = state.volume / 100;
};

const modeChange = () => ({});

onMounted(() => {
  // 设置audio元素
  nextTick(() => {
    musicStore.setAudioEle(audio.value);
  });

  document.addEventListener("click", (e: Event) => {
    if (e.target.className != "iconfont icon-laba") {
      state.target = true;
    }
  });
  audio.value.volume = 0.3;
  // 自动播放下一首
  audio.value.onended = () => {
    !state.loop ? next() : null;
  };
  // 音乐播放出错
  audio.value.onerror = () => {
    prevPlayList.value.length ? console.error("暂时无法播放，已自动播放下一首") : null;
    next();
    // console.log('播放出错啦！')
  };
  // 开始播放音乐
  audio.value.onplay = () => {
    state.playing = true;
  };
  // 初始化按键事件
  nextTick(() => {
    initKeyDown();
  });
  // 将能播放的音乐加入播放历史
  audio.value.oncanplay = () => {
    if (historyList.value.length === 0 || prevPlaySong.value.id !== historyList.value[0].id) {
      musicStore.setHistory(prevPlaySong.value);
    }
  };
});
</script>

<style lang="scss" scoped>
.main-page {
  overflow: hidden;
  height: 100%;
  width: 100%;
  .menu {
    float: left;
    height: 100%;
    width: 100px;
    background: -webkit-gradient(linear, 0 0, 0 bottom, from(#9530a330), to(#dedfdf));

    // background-color: #dedfdf;
    // filter: blur(5px);
    .menu-icon-list {
      height: 100%;
      width: 70px;

      .iconFontItem {
        padding: 10px 0px;
        text-align: center;
        transition: all 0.5s ease;
        cursor: pointer;

        &:hover {
          background-color: #9530a3;

          .iconfont {
            color: #fff;
          }

          a {
            color: #fff;
          }
        }

        .iconfont {
          display: block;
          width: 100%;
          font-size: 30px;
        }

        a {
          font-size: 12px;
          color: #000;
        }
      }
    }
  }

  .main-container {
    margin-left: 100px;
    height: 100%;
    position: relative;
  }

  .heades {
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: relative;
    .input {
      background-color: #fafafa;
      padding-left: 20px;
      width: 320px;
      color: #b6b6b9;
      // background-color: #eae8e7;
      height: 30px;
      font-size: 16px;
      outline: none;
      outline-color: invert;
      outline-style: none;
      outline-width: 0px;
      border: none;
      border-style: none;
      text-shadow: none;
      -webkit-appearance: none;
      -webkit-user-select: text;
      outline-color: transparent;
      box-shadow: none;
      border-bottom: 1px solid #abacaf;
    }

    .icon-sousuo1 {
      position: absolute;
      right: calc(50% - 160px);
      font-size: 25px;
      color: #434343;
      cursor: pointer;
    }
  }

  .musicControl {
    position: absolute;
    bottom: 0px;
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;

    .iconControl {
      margin-left: 120px;

      .itemControl {
        position: relative;
        float: left;
        line-height: 50px;
        text-align: center;
        bottom: 0px;
        width: 50px;
        height: 50px;
        margin-left: 10px;
        cursor: pointer;
        transition: all 0.5s ease;

        &:hover {
          .itemBorder {
            display: inline-block;
          }

          .iconfont {
            color: #9530a3;
          }
        }

        .iconfont {
          position: absolute;
          top: 0;
          left: 15px;
          z-index: 99;
          text-align: center;
          line-height: 50px;
          font-size: 25px;
        }

        .itemBorder {
          position: absolute;
          top: 2px;
          left: 3px;
          display: none;
          border: 1px solid #7b7b7d;
          background-color: #e6e6e6;
          width: 45px;
          height: 45px;
          border-radius: 35px;
        }
      }

      .volume-slider {
        position: absolute;
        top: 22px;
        z-index: 999;
        left: 310px;
        width: 60px;
      }
    }

    .musicSilder {
      width: 430px;
      margin-left: 20px;
    }

    .musicBarTime {
      margin-left: 20px;
      font-size: 18px;
    }

    .minBox {
      cursor: pointer;

      &:hover {
        background-color: #9530a330;
      }

      position: absolute;
      right: 20px;
      width: 270px;
      height: 70px;

      .minImg {
        margin-left: 5px;
        margin-top: 5px;
        float: left;
        width: 60px;
        height: 60px;
        line-height: 70px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .infoBox {
        float: left;

        .prevsonger,
        .prevName {
          margin-top: 10px;
          display: block;
          margin-left: 10px;
          width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .prevsonger {
          font-size: 16px;
          font-weight: 700;
        }
      }
    }
  }

  // 弹框动画
  .mu-scale-transition-enter-active,
  .mu-scale-transition-leave-active {
    transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1);
    backface-visibility: hidden;
  }

  .mu-scale-transition-enter,
  .mu-scale-transition-leave-active {
    transform: scale(0);
    opacity: 0;
  }

  .mainContainer {
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    top: 52px;
    left: 70px;
    background-color: #fff;
    width: calc(100% - 70px);
    height: calc(100% - 122px);
    // box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.3);
    box-shadow: -5px 3px 13px rgba(0, 0, 0, 0.2);
  }
}
</style>
