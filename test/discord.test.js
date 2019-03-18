const fs = require('fs');

beforeEach(() =>  {
  jest.mock('dotenv', () => ({
    config: () => null
  }));
  jest.mock('discord.js', () => ({
    Client: class extends require('events') {
      login() {}
      get user() {
        return {
          username: 'Moon Cell',
          setPresence: () => null
        }
      }
    },
    RichEmbed: class {
      constructor() {
        this.data = {};
      }
      setAuthor(a) {
        this.data.author = a;
        return this;
      }
      setDescription(d) {
        this.data.description = d;
        return this;
      }
      setImage(i) {
        this.data.image = i;
        return this;
      }
      setFooter(f) {
        this.data.footer = f;
        return this;
      }
      setColor(c) {
        this.data.color = c;
        return this;
      }
      addField(k, v) {
        this.data[k] = v;
        return this;
      }
      attachFile(f) {
        this.data.file = f;
        return this;
      }
    }
  }));
});

afterEach(() =>  {
    jest.resetModules();
});

let sendMsg = msg => {
  let client = require('../discord.js');
  client.emit('ready');
  client.emit('message', msg);
};

test('ignores when not mentioned', () => {
  let msg = {
    content: '<@30422> jeanne alter',
    isMentioned: user => user.username != 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(0);
});

test('reacts when not found', () => {
  let msg = {
    content: '<@30422> theresa apocalypse',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(1);
  expect(msg.reply.mock.calls.length).toBe(0);
  expect(msg.react.mock.calls[0][0]).toBe('🤔');
});

test('accepts disordered queries', () => {
  let msg = {
    content: '   kyrie      <@30422>   mash    ',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(1);
  expect(fs.statSync(msg.reply.mock.calls[0][0].embed.data.file).isFile())
    .toBe(true);
  expect(msg.reply.mock.calls[0][0].embed.data.author)
    .toBe('Mash Kyrielight');
});

test('accepts partial name queries', () => {
  let msg = {
    content: '<@30422> jeanne alter',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(1);
  expect(fs.statSync(msg.reply.mock.calls[0][0].embed.data.file).isFile())
    .toBe(true);
  expect(msg.reply.mock.calls[0][0].embed.data.author)
    .toBe('Jeanne d\'Arc (Alter) (Avenger)');
});

test('accepts class plus name queries', () => {
  let msg = {
    content: '<@30422> lancer jeanne',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(1);
  expect(fs.statSync(msg.reply.mock.calls[0][0].embed.data.file).isFile())
    .toBe(true);
  expect(msg.reply.mock.calls[0][0].embed.data.author)
    .toBe('Jeanne d\'Arc Alter Santa Lily');
});

test('accepts class queries', () => {
  let msg = {
    content: '<@30422> foreigner',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(1);
  expect(fs.statSync(msg.reply.mock.calls[0][0].embed.data.file).isFile())
    .toBe(true);
  expect(msg.reply.mock.calls[0][0].embed.data.author)
    .toBe('Abigail Williams');
});

test('summons 0* servants', () => {
  jest.mock('math-random', () => () => 0.00007);
  let msg = {
    content: '  <@57033925475>     ',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(1);
  expect(fs.statSync(msg.reply.mock.calls[0][0].embed.data.file).isFile())
    .toBe(true);
  expect(msg.reply.mock.calls[0][0].embed.data.description)
    .toMatch('0:');
});

test('summons 1* servants', () => {
  jest.mock('math-random', () => () => 0.22);
  let msg = {
    content: '<@57033925475> ',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(1);
  expect(fs.statSync(msg.reply.mock.calls[0][0].embed.data.file).isFile())
    .toBe(true);
  expect(msg.reply.mock.calls[0][0].embed.data.description)
    .toMatch('1:');
});

test('summons 2* servants', () => {
  jest.mock('math-random', () => () => 0.5);
  let msg = {
    content: '<@000000>',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(1);
  expect(fs.statSync(msg.reply.mock.calls[0][0].embed.data.file).isFile())
    .toBe(true);
  expect(msg.reply.mock.calls[0][0].embed.data.description)
    .toMatch('2:');
});

test('summons 3* servants', () => {
  jest.mock('math-random', () => () => 0.75);
  let msg = {
    content: '<@000000>',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(1);
  expect(fs.statSync(msg.reply.mock.calls[0][0].embed.data.file).isFile())
    .toBe(true);
  expect(msg.reply.mock.calls[0][0].embed.data.description)
    .toMatch('3:');
});

test('summons 4* servants', () => {
  jest.mock('math-random', () => () => 0.98);
  let msg = {
    content: '    <@0xDEAD>',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(1);
  expect(fs.statSync(msg.reply.mock.calls[0][0].embed.data.file).isFile())
    .toBe(true);
  expect(msg.reply.mock.calls[0][0].embed.data.description)
    .toMatch('4:');
});

test('summons 5* servants', () => {
  jest.mock('math-random', () => () => 0.999);
  let msg = {
    content: '<@>',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(1);
  expect(fs.statSync(msg.reply.mock.calls[0][0].embed.data.file).isFile())
    .toBe(true);
  expect(msg.reply.mock.calls[0][0].embed.data.description)
    .toMatch('5:');
});
