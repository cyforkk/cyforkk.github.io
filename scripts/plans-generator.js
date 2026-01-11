// Hexo 插件：将 plans.yml 转换为 plans.json
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

hexo.extend.generator.register('plans', function(locals) {
  const dataDir = path.join(hexo.source_dir, '_data');
  const plansFile = path.join(dataDir, 'plans.yml');

  // 检查文件是否存在
  if (!fs.existsSync(plansFile)) {
    hexo.log.warn('plans.yml 文件不存在，跳过生成 plans.json');
    return [];
  }

  try {
    // 读取并解析 YAML 文件
    const fileContent = fs.readFileSync(plansFile, 'utf8');
    const plansData = yaml.load(fileContent);

    // 返回生成的 JSON 文件
    return [{
      path: 'plans.json',
      data: JSON.stringify(plansData, null, 2)
    }];
  } catch (error) {
    hexo.log.error('解析 plans.yml 失败:', error);
    return [];
  }
});
