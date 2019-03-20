const fs = require('fs');

// Setup environment------------------------------------------------------------
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

// Trivial cases----------------------------------------------------------------
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

// Query cases------------------------------------------------------------------
test('accepts disordered queries', done => {
  let msg = {
    content: '   kyrie      <@30422>   mash    ',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: o => {
      expect(msg.react.mock.calls.length).toBe(0);
      expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
      expect(o.embed.data.author).toBe('Mash Kyrielight');
      expect(o.embed.data.color).toBe('#442d39');
      done();
    }
  };
  sendMsg(msg);
});

test('accepts partial name queries', done => {
  let msg = {
    content: '<@30422> jeanne alter',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: o => {
      expect(msg.react.mock.calls.length).toBe(0);
      expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
      expect(o.embed.data.author).toBe('Jeanne d\'Arc (Alter) (Avenger)');
      expect(o.embed.data.color).toBe('#091f3f');
      done();
    }
  };
  sendMsg(msg);
});

test('accepts class plus name queries', done => {
  let msg = {
    content: '<@30422> lancer jeanne',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: o => {
      expect(msg.react.mock.calls.length).toBe(0);
      expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
      expect(o.embed.data.author).toBe('Jeanne d\'Arc Alter Santa Lily');
      expect(o.embed.data.color).toBe('#eab6ba');
      done();
    }
  };
  sendMsg(msg);
});

test('accepts class queries', done => {
  let msg = {
    content: '<@30422> foreigner',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: o => {
      expect(msg.react.mock.calls.length).toBe(0);
      expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
      expect(o.embed.data.author).toBe('Abigail Williams');
      expect(o.embed.data.color).toBe('#493b5f');
      done();
    }
  };
  sendMsg(msg);
});

// Summon cases-----------------------------------------------------------------
test('summons 0* servants', done => {
  jest.mock('math-random', () => () => 0.00007);
  let msg = {
    content: '  <@57033925475>     ',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: o => {
      expect(msg.react.mock.calls.length).toBe(0);
      expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
      expect(o.embed.data.description).toMatch('0:');
      expect(o.embed.data.color).toMatch(/#[0-9a-f]{6}/);
      done();
    }
  };
  sendMsg(msg);
});

test('summons 1* servants', done => {
  jest.mock('math-random', () => () => 0.22);
  let msg = {
    content: '<@57033925475> ',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: o => {
      expect(msg.react.mock.calls.length).toBe(0);
      expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
      expect(o.embed.data.description).toMatch('1:');
      expect(o.embed.data.color).toMatch(/#[0-9a-f]{6}/);
      done();
    }
  };
  sendMsg(msg);
});

test('summons 2* servants', done => {
  jest.mock('math-random', () => () => 0.5);
  let msg = {
    content: '<@000000>',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: o => {
      expect(msg.react.mock.calls.length).toBe(0);
      expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
      expect(o.embed.data.description).toMatch('2:');
      expect(o.embed.data.color).toMatch(/#[0-9a-f]{6}/);
      done();
    }
  };
  sendMsg(msg);
});

test('summons 3* servants', done => {
  jest.mock('math-random', () => () => 0.75);
  let msg = {
    content: '<@000000>',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: o => {
      expect(msg.react.mock.calls.length).toBe(0);
      expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
      expect(o.embed.data.description).toMatch('3:');
      expect(o.embed.data.color).toMatch(/#[0-9a-f]{6}/);
      done();
    }
  };
  sendMsg(msg);
});

test('summons 4* servants', done => {
  jest.mock('math-random', () => () => 0.98);
  let msg = {
    content: '    <@0xDEAD>',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: o => {
      expect(msg.react.mock.calls.length).toBe(0);
      expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
      expect(o.embed.data.description).toMatch('4:');
      expect(o.embed.data.color).toMatch(/#[0-9a-f]{6}/);
      done();
    }
  };
  sendMsg(msg);
});

test('summons 5* servants', done => {
  jest.mock('math-random', () => () => 0.999);
  let msg = {
    content: '<@>',
    isMentioned: user => user.username == 'Moon Cell',
    react: jest.fn(),
    reply: o => {
      expect(msg.react.mock.calls.length).toBe(0);
      expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
      expect(o.embed.data.description).toMatch('5:');
      expect(o.embed.data.color).toMatch(/#[0-9a-f]{6}/);
      done();
    }
  };
  sendMsg(msg);
});
