const storage = {
  get(key: string, defa = []) {
    if (window.localStorage) {
      return localStorage.getItem(key) ? (Array.isArray(defa) ? JSON.parse(localStorage.getItem(key) as string) : localStorage.getItem(key)) : defa;
    }
  },
  set(key: string, val: string) {
    if (window.localStorage) {
      localStorage.setItem(key, val);
    }
  },
  clear(key: string) {
    if (window.localStorage) {
      localStorage.removeItem(key);
    }
  },
};

/**
 * 播放历史
 * @type    HISTORYLIST_KEY：key值
 *          HistoryListMAX：最大长度
 */
const HISTORYLIST_KEY = "_purpleLight__historyList__";
const HistoryListMAX = 50;
// 获取播放历史
export function getHistoryList() {
  return storage.get(HISTORYLIST_KEY);
}

// 更新播放历史
export function setHistoryList(music: object) {
  const list = storage.get(HISTORYLIST_KEY);
  if (list != "{}") {
    list.forEach((item: any, m: number) => {
      if (item == "{}") {
        list.split(m, 1);
      }
    });
  }
  const index = list.findIndex((item: any) => {
    return item.id === music.id;
  });
  if (index === 0) {
    return list;
  }
  if (index > 0) {
    list.splice(index, 1);
  }
  list.unshift(music);
  if (HistoryListMAX && list.length > HistoryListMAX) {
    list.pop();
  }
  storage.set(HISTORYLIST_KEY, JSON.stringify(list));
  return list;
}

// 删除一条播放历史
export function removeHistoryList(music: any) {
  storage.set(HISTORYLIST_KEY, JSON.stringify(music));
  return music;
}

// 清空播放历史
export function clearHistoryList() {
  storage.clear(HISTORYLIST_KEY);
  return [];
}
