<template>
  <div ref="homePage" class="homePage-container" @scroll="handleScroll">
    <span :class="state.titleActive ? 'titleActive' : 'title'">{{ state.hello }}</span>
    <div class="recommend-containter">
      <div class="history">为你推荐</div>
      <div class="recommendBox">
        <!-- {{qq_allDataList.recomPlaylist}} -->
        <!-- <slider
          ref="slider"
          :options="options"
          class="itemBox"
          v-if="historyData"
        >
          <slideritem
            class="item"
            v-for="item in qqAllData"
            :key="item.content_id"
            @click="goSongDetails(item.id)"
          >
            <div class="imgBox">
              <img :src="item.cover" alt />
            </div>
            <span class="imgTitle" :title="item.title">{{item.title}}</span>
            <span class="listenNum" :title="item.listen_num">{{item.listen_num}}</span>
          </slideritem>
        </slider> -->
      </div>
    </div>
    <div class="like-container">
      <div class="history">上次播放</div>
      <ul v-if="state.historyData" class="likeBox">
        <li v-for="item in state.historyData" :key="item.id" class="itemLike" @click="goSongDetails(item.id)">
          <div v-if="item.al" class="imgLike">
            <img :src="item.al.picUrl" alt />
          </div>
          <span v-if="item.name" class="imgTitle" :title="item.name">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, computed, onMounted, nextTick, onUnmounted } from "vue";
// import { slider, slideritem } from "vue-concise-slider";
import { useRouter } from "vue-router";
import { useMusicStore } from "../stores/music";

const musicStore = useMusicStore();

const router = useRouter();

const state = reactive({
  hello: "",
  historyData: [],
  titleActive: false,
  options: {
    currentPage: 0,
  },
});

const historyList = computed(() => musicStore.historyList);

// 清除历史记录中的空对象
if (historyList.value) {
  historyList.value.forEach((ele, index) => {
    if (ele.name != undefined) {
      state.historyData.push(ele);
    }
  });
}

let time = new Date().getHours(); //获取当前小时数(0-23)
if (0 < time && time < 5) {
  state.hello = "晚上好";
} else if (5 <= time && time < 11) {
  state.hello = "早上好";
} else if (11 <= time && time < 14) {
  state.hello = "中午好";
} else if (14 <= time && time < 18) {
  state.hello = "下午好";
} else {
  state.hello = "晚上好";
}

const handleScroll = () => {
  if (document.querySelector(".mainContainer").scrollTop > 50) {
    state.titleActive = true;
  } else {
    state.titleActive = false;
  }
};

const goSongDetails = (songId: number) => {
  musicStore.setPrevPlayList(musicStore.historyList);
  musicStore.historyList.forEach((item) => {
    if (item.id == songId) {
      musicStore.setPrevPlaySong(item);
    }
  });
  router.push({
    name: "songDetails",
    params: { songId },
  });
};

onMounted(() => {
  nextTick(() => {
    window.addEventListener("scroll", handleScroll, true);
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
<style lang="scss" scoped>
.homePage-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin-left: 20px;
  margin: 20px;
  background-color: #fff;

  .titleActive {
    padding-left: 20px;
    position: fixed;
    display: block;
    left: 70px;
    top: 52px;
    line-height: 100px;
    font-size: 30px;
    font-weight: 700;
    width: 100%;
    background-color: #f8f8f8;
    opacity: 0.95;
    z-index: 2;
  }

  .title {
    transition: all 1s ease;
    margin-top: 150px;
    display: block;
    font-size: 50px;
    font-weight: 700;
  }

  .recommend-containter {
    .history {
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      font-size: 20px;
      font-weight: 700;
    }

    .recommendBox {
      // height: 300px;
      // width: 250%;
      .itemBox {
        overflow: hidden;
        margin-top: 20px;

        .item {
          float: left;
          width: 250px;
          height: 250px;
          margin-left: 20px;

          .imgBox {
            img {
              width: 250px;
              height: 250px;
            }
          }
        }
      }
    }
  }

  .like-container {
    .history {
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      font-size: 20px;
      font-weight: 700;
    }

    .likeBox {
      padding-left: 10px;
      padding-top: 10px;

      // display: flex;
      // justify-content: space-around;
      .itemLike {
        float: left;
        margin: 20px;
        text-align: center;
        cursor: pointer;

        .imgLike {
          background-color: #9530a3;
          width: 200px;
          height: 200px;

          img {
            width: 200px;
            height: 200px;
          }
        }

        .imgTitle {
          font-size: 14px;
          display: block;
          line-height: 30px;
          height: 30px;
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
