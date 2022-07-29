const hrefType = {
  playlist: {
    time: '#content ytd-playlist-video-list-renderer ytd-thumbnail-overlay-time-status-renderer #text',
    info: '#content ytd-playlist-sidebar-primary-info-renderer #stats',
  },
  watch: {
    time: '#content ytd-playlist-panel-renderer ytd-thumbnail-overlay-time-status-renderer #text',
    info: '#content ytd-playlist-panel-renderer #header-description',
  },
  video: {
    time: '#content ytd-player .ytp-time-duration',
    info: '#content ytd-player .ytp-time-display span:nth-child(2)',
  },
};

const run = () => {
  let viewType;
  const hrefPlaylist = window.location.href.includes('playlist');
  if (hrefPlaylist) viewType = hrefType.playlist;
  const hrefWatch = window.location.href.includes('watch');
  if (hrefWatch) viewType = hrefType.watch;
  if (!viewType) return;

  // play list
  const list = document.querySelectorAll(viewType.time);
  if (list) {
    const total = calcTime(list);
    const content = `Playlist Duration: ${getHMSText(total)} ⏱`;
    render(viewType.info, total, content, 'p');
  }

  // video time
  const videoTime = document.querySelectorAll(hrefType.video.time);
  if (hrefWatch && videoTime) {
    const total = calcTime(videoTime);
    const content = ` ⏱`;
    render(hrefType.video.info, total, content, 'span');
  }
};

const calcTime = (list) => {
  let total = 0;
  for (let elem of list) {
    total += getTime(elem.innerText);
  }
  return total;
};

const getTime = (text) => {
  const [s = 0, m = 0, h = 0] = text
    .trim()
    .split(':')
    .reverse()
    .map((a) => +a);
  return [h, m, s].reduce((a, b) => a * 60 + b);
};

const getHMS = (sec) => {
  return [
    Math.floor(sec / 3600),
    Math.floor(sec / 60) % 60,
    Math.floor(sec % 60),
  ];
};

const getHMSText = (sec, speed = 1) => {
  const [h, m, s] = getHMS(sec / speed);
  return `${h}h ${m}m ${s}s`;
};

const render = (info, total, content, moreTag) => {
  const infoDiv = document.querySelector(info);

  let span = infoDiv.querySelector('#playback-time');
  if (!span) {
    span = document.createElement(moreTag);
    span.setAttribute('id', 'playback-time');
    more = document.createElement('span');
  }
  span.textContent = content;
  span.title = `[Playback speed]\n`;
  span.title += `0.25x: ${getHMSText(total / 0.25)}\n`;
  span.title += `0.50x: ${getHMSText(total / 0.5)}\n`;
  span.title += `0.75x: ${getHMSText(total / 0.75)}\n`;
  span.title += `1.25x: ${getHMSText(total / 1.25)}\n`;
  span.title += `1.75x: ${getHMSText(total / 1.75)}\n`;
  span.title += `2.00x: ${getHMSText(total / 2.0)}`;

  infoDiv.appendChild(span);
  infoDiv.appendChild(more);
};

setInterval(run, 1500);
