function fetchHitokoto() {
    fetch('https://v1.hitokoto.cn?encode=json')
      .then(response => response.json())
      .then(data => {
        const container = document.querySelector('.subtitle');
        const typed = new Typed('#subtitle', {
          strings: [data.hitokoto],
          typeSpeed: 150,
          loop: false,
          onComplete: () => {
            setTimeout(() => {
              typed.destroy();
              fetchHitokoto();
            }, 5000); // 3秒后获取下一句
          }
        });
      })
      .catch(error => console.error('Error:', error));
  }
  
  document.addEventListener('DOMContentLoaded', fetchHitokoto);