document.addEventListener('pjax:complete', function() {
  // 保存当前播放状态
  const ap = document.querySelector('.aplayer');
  if (ap && ap.aplayer) {
    const list = ap.aplayer.list;
    const currentTime = ap.aplayer.audio.currentTime;
    const paused = ap.aplayer.audio.paused;
    const volume = ap.aplayer.audio.volume;
    const index = ap.aplayer.list.index;

    // 在页面切换后恢复播放状态
    setTimeout(() => {
      if (ap && ap.aplayer) {
        ap.aplayer.list.switch(index);
        ap.aplayer.seek(currentTime);
        ap.aplayer.volume(volume);
        if (!paused) {
          ap.aplayer.play();
        }
      }
    }, 100);
  }
});

// 防止播放器被销毁
document.addEventListener('pjax:send', function() {
  const ap = document.querySelector('.aplayer');
  if (ap && ap.aplayer) {
    ap.aplayer.options.storageName = 'aplayer-setting';
  }
});
