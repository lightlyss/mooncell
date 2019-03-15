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

test('accepts empty queries', () => {
  let msg = {
    content: '<@30422>',
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

test('accepts partial queries', () => {
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

test('accepts class queries', () => {
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
