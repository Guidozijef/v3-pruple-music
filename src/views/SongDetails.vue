<template>
  <div class="songDetails-container">
    <div class="bg" :style="{ backgroundImage: 'url(' + bgImg + ')', height: state.containerHeight }"></div>
    <div class="mark" :style="{ width: state.containerWidth, height: state.containerHeight }"></div>
    <div class="songInfo">
      <div class="songImg" v-if="prevPlaySong">
        <img :src="prevPlaySong.al.picUrl" alt srcset />
      </div>
      <div class="songItem">
        <span class="songer">{{ prevPlaySong.ar[0].name }}</span>
        <span class="song">{{ prevPlaySong.name }}</span>
        <span class="songar">{{ prevPlaySong.al.name }}</span>
      </div>
    </div>
    <div class="ricBox" ref="musicLyric">
      <div class="songRicBox" :style="lyricTop">
        <ul v-if="!state.noLyric">
          <li style="margin-top: 50px; height: 20px"></li>
          <li class="ricItem" v-for="(item, index) in songPlayLrc" :key="index">
            <span class="ricText" :class="{ active: state.lyricIndex == index ? true : false }">{{ item.clause }}</span>
          </li>
        </ul>
        <span style="text-align: center; font-size: 16px; line-height: 400px; color: #9530a3" v-if="state.noLyric">暂无歌词！</span>
      </div>
      <canvas id="canvas" ref="canvas" width="800" height="600">Your browser does not support Canvas tag.</canvas>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import { useMusicStore } from "@/stores/music";
import { useRoute } from "vue-router";

const route = useRoute();

const state = reactive({
  // songInfo: "",
  // lyric: [],
  resizeTimer: 0,
  value: 0, // 前面五条歌词先不滚动
  lyricIndex: 0, // 当前歌词的索引
  noLyric: false,
  top: 0, // 歌词居中
  containerWidth: document.body.clientWidth - 70 + "px",
  containerHeight: window.innerHeight - 122 + "px",
});

const musicStore = useMusicStore();

const musicLyric = ref();

const currentTime = computed(() => musicStore.currentTime);
const prevPlayList = computed(() => musicStore.prevPlayList);
const prevPlaySong = computed(() => musicStore.prevPlaySong);
const songPlayLrc = computed(() => musicStore.songPlayLrc);
const audioEle = computed(() => musicStore.audioEle);
const bgImg = computed(() => musicStore.prevPlaySong.al.picUrl);
const currentTime1 = computed(() => currentTime.value);
const lyricTop = computed(() => `transform :translate3d(0, ${-36 * (state.lyricIndex + 1 - state.top)}px, 0)`);

onMounted(() => {
  changeResize();
  console.log(route.params.songId);
  const songId: string | string[] = route.params.songId;
  musicStore.getSongPlayUrl(parseInt(songId as string));
  musicStore.getSongLyric(parseInt(songId as string));
});

const changeResize = () => {
  window.addEventListener("resize", () => {
    clearTimeout(state.resizeTimer);
    state.resizeTimer = setTimeout(() => clacTop(), 60);
  });
  nextTick(() => clacTop());
};

const clacTop = () => {
  if (musicLyric.value) {
    let height = musicLyric.value.offsetHeight;
    state.top = Math.floor(height / 36 / 2);
  }
};

watch(currentTime, (val) => {
  if (songPlayLrc.value.length) {
    for (let index = 0; index < songPlayLrc.value.length; index++) {
      const element = songPlayLrc.value[index];
      // var css = element.times < parseInt(val) < songPlayLrc.value[index+1].times ? true : false;
      if (element.times <= val) {
        // this.value = index >= 4 ? index : 0;
        state.lyricIndex = index;
      }
      // if(val > element.times){
      //   this.lyricIndex = index;
      // }
    }
  }
});
</script>
<style lang="scss" scoped>
.songDetails-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  .bg {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    filter: blur(12px);
    opacity: 0.7;
    position: fixed;
  }
  .mark {
    background-color: #000;
    opacity: 0.5;
    position: fixed;
    z-index: 2;
  }
  .songInfo {
    position: relative;
    z-index: 10;
    margin-left: 50px;
    display: inline-block;
    .songImg {
      img {
        width: 300px;
        height: 300px;
        margin-top: 50px;
      }
    }
    .songItem {
      .song,
      .songer,
      .songar {
        display: block;
        width: 300px;
        font-size: 14px;
        line-height: 30px;
        color: #fff;
      }
      .song {
        font-weight: 700;
        font-size: 20px;
      }
    }
  }
  .ricBox {
    z-index: 10;
    overflow: hidden;
    position: relative;
    height: 500px;
    width: 400px;
    float: right;
    top: 50px;
    right: 150px;
    .songRicBox {
      transition: all 0.5s ease;
      position: absolute;
      top: 0;
      left: 0;
      width: 400px;
      // height: 400px;
      .ricItem {
        line-height: 35px;
        text-align: center;
      }
      .ricText {
        color: #aeafaa;
        font-size: 16px;
        font-family: "Mircosoft YaHei";
      }
      // 当前歌词样式
      .active {
        color: #fff;
      }
    }
  }
}
</style>
