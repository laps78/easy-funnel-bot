import messages from '../messages.js';

console.info('Тестирование массива сообщений бота...');

test('Проверка существования объекта', () => {
  expect(messages).toBeDefined();
});

test(`Проверка типа сущности`, () => {
  expect(messages).toBeInstanceOf(Array);
});

test(`Проверка наличия сообщений в массиве`, () => {
  expect(messages.length).toBeGreaterThan(0);
});

console.info(`Проверка сообщений в массиве`);

for (let message of messages) {
  test(`Проверяем длину текста сообщения`, () => {
  expect(message.text.length).not.toBeGreaterThan(4096);
  });
};
