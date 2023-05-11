import bot from '../tg.js';
import {Telegraf} from 'telegraf';

test('Проверяем возможность создания экземпляр бота', ()=>{
  expect(bot).toBeInstanceOf(Telegraf);
})
