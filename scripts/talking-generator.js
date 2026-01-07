const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

hexo.extend.generator.register('talking', function(locals) {
  const talkingPath = path.join(hexo.source_dir, '_data', 'talking.yml');

  if (!fs.existsSync(talkingPath)) {
    return [];
  }

  try {
    const talkingData = yaml.load(fs.readFileSync(talkingPath, 'utf8'));

    // 按日期降序排序
    if (Array.isArray(talkingData)) {
      talkingData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return [{
      path: 'talking.json',
      data: JSON.stringify(talkingData || [])
    }];
  } catch (error) {
    console.error('生成说说数据失败:', error);
    return [];
  }
});
