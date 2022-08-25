const run = () => {
  youtubePlayListTime();
  youtubeWatchListTime();
  youtubeVideoTime();
  udemyCourseTime();
  udemyCourseSectionTime();
};

const youtubePlayListTime = () => {
  const href = window.location.href;
  const hrefCheck = href.includes('youtube.com') && href.includes('playlist');
  if (!hrefCheck) return;
  // console.log('youtube.com youtubePlayListTime');

  const target = {
    time: '#content ytd-playlist-video-list-renderer ytd-thumbnail-overlay-time-status-renderer #text',
    info: '#content ytd-playlist-sidebar-primary-info-renderer #stats',
  };

  const list = document.querySelectorAll(target.time);
  if (list) {
    const total = calcTime(list);
    const content = `Playlist Duration: ${getHMSText(total)} ⏱`;
    render(target.info, total, content, 'p');
  }
};

const youtubeWatchListTime = () => {
  const href = window.location.href;
  const hrefCheck = href.includes('youtube.com') && href.includes('watch');
  if (!hrefCheck) return;
  // console.log('youtube.com youtubeWatchListTime');

  const target = {
    time: '#content ytd-playlist-panel-renderer ytd-thumbnail-overlay-time-status-renderer #text',
    info: '#content ytd-playlist-panel-renderer #header-description',
  };

  const list = document.querySelectorAll(target.time);
  if (list) {
    const total = calcTime(list);
    const content = `Playlist Duration: ${getHMSText(total)} ⏱`;
    render(target.info, total, content, 'p');
  }
};

const youtubeVideoTime = () => {
  const href = window.location.href;
  const hrefCheck = href.includes('youtube.com') && href.includes('watch');
  if (!hrefCheck) return;
  // console.log('youtube.com youtubeVideoTime');

  const target = {
    time: '#content ytd-player .ytp-time-duration',
    info: '#content ytd-player .ytp-time-display span:nth-child(2)',
  };

  const videoTime = document.querySelectorAll(target.time);
  if (videoTime) {
    const total = calcTime(videoTime);
    const content = ` ⏱`;
    render(target.info, total, content, 'span');
  }
};

const udemyCourseTime = () => {
  const href = window.location.href;
  const hrefCheck = href.includes('udemy.com') && href.includes('course');
  if (!hrefCheck) return;
  // console.log('udemy.com course udemyCourseTime');

  const target =
    '[data-purpose=dashboard-overview-container] [data-purpose=course-additional-stats] div:last-child';
  const videoTime = document.querySelector(target);
  if (videoTime) {
    const time = parseFloat(videoTime.innerText.replace(/[^0-9\.]/g, ''));
    const total = String(time * 60 * 60);
    const content = ` ⏱`;
    render(target.fo, total, content, 'span');
  }
};

const udemyCourseSectionTime = () => {
  const href = window.location.href;
  const hrefCheck = href.includes('udemy.com') && href.includes('course');
  if (!hrefCheck) return;
  // console.log('udemy.com course udemyCourseSectionTime');

  const target =
    '[data-purpose=curriculum-section-container] [data-purpose=section-duration]';
  const videoTimes = document.querySelectorAll(target);
  if (videoTimes) {
    for (let elem of videoTimes) {
      const text = elem.innerText
        .split('|')[1]
        .replace(/[^0-9]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .reverse();

      const [m = 0, h = 0] = text;
      const total = String(h * 60 * 60 + m * 60);
      const content = ` ⏱`;

      let more = elem.querySelector('#playback-time');
      if (!more) {
        more = document.createElement('span');
        more.setAttribute('id', 'playback-time');
      }
      more.textContent = content;
      more.title = getPlaybackSpeed(total, [0.5, 0.75, 1.25, 1.5, 1.75, 2.0]);
      elem.appendChild(more);
    }
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

  let more = infoDiv.querySelector('#playback-time');
  if (!more) {
    more = document.createElement(moreTag);
    more.setAttribute('id', 'playback-time');
  }
  more.textContent = content;
  more.title = getPlaybackSpeed(total, [0.25, 0.5, 0.75, 1.25, 1.5, 1.75, 2.0]);

  infoDiv.appendChild(more);
};

const getPlaybackSpeed = (total, speedArr) => {
  return (
    `[Playback speed]\n` +
    speedArr
      .map((speed) => `${String(speed)}x: ${getHMSText(total / speed)}`)
      .join(`\n`)
  );
};

setInterval(run, 1500);
