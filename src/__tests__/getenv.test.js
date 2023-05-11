import botConfig from '../getenv.js';
console.log(botConfig)
test('Валидация объекта настроек бота', ()=>{
  expect(botConfig).toBeDefined();
  expect(botConfig.tg.tg_api_key.length).toBe(46);
})
