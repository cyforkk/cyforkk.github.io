const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

hexo.extend.generator.register('link', function(locals) {
  const linkPath = path.join(hexo.source_dir, '_data', 'links.yml');

  if (!fs.existsSync(linkPath)) {
    return [];
  }

  try {
    const linkData = yaml.load(fs.readFileSync(linkPath, 'utf8'));

    return [{
      path: 'links.json',
      data: JSON.stringify(linkData || [])
    }];
  } catch (error) {
    console.error('生成友链数据失败:', error);
    return [];
  }
});
