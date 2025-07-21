// random_sentence.js
const express = require('express');
const router = express.Router();

// 随机句子列表
const sentences = [
  '欲速则不达',
  '今日事，今日毕',
  '行成于思，行成于心',
  '千里之行，始于足下',
  '不积跬步，无以至千里',
  '不积小流，无以成江海',
  '学而时习之，不亦说乎',  
  '业精于勤荒于嬉，行成于思毁于随。 ——韩愈',
  '欲修其身者，先正其心；欲正其心者，先诚其意。 ——韩愈',
  '天行健，君子以自强不息。——《周易》',
  '勿以恶小而为之，勿以善小而不为。——刘备',
  '见贤思齐焉，见不贤而内自省也。——《论语》',
  '已所不欲，勿施于人。——《论语》',
  '满招损，谦受益。——《尚书》',
  '学而不思则罔，思而不学则殆。——《论语》',
  '不积跬步，无以至千里，不积小流，无以成江海。——《荀子·劝学》',
  '羊有跪乳之恩，鸦有反哺之义。——《增广贤文》',
  '生当作人杰，死亦为鬼雄。——宋·李清照《夏日绝句》',
  '学如逆水行舟，不进则退。——《增广贤文》'
];

// 随机抽取句子的接口
router.get('/random-sentence', (req, res) => {
  const randomIndex = Math.floor(Math.random() * sentences.length);
  const randomSentence = sentences[randomIndex];
  res.json({ sentence: randomSentence });
});

module.exports = router;