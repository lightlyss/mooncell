const fs = require('fs');

// Setup environment------------------------------------------------------------
beforeEach(() => {
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
        };
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

afterEach(() => {
  jest.resetModules();
});

const sendMsg = msg => {
  const client = require('../discord.js');
  client.emit('ready');
  client.emit('message', msg);
};

// Trivial cases----------------------------------------------------------------
test('ignores when not mentioned', () => {
  const msg = {
    content: '<@30422> jeanne alter',
    isMentioned: user => user.username !== 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(0);
  expect(msg.reply.mock.calls.length).toBe(0);
});

test('reacts when not found', () => {
  const msg = {
    content: '<@30422> theresa apocalypse',
    isMentioned: user => user.username === 'Moon Cell',
    react: jest.fn(),
    reply: jest.fn()
  };
  sendMsg(msg);
  expect(msg.react.mock.calls.length).toBe(1);
  expect(msg.reply.mock.calls.length).toBe(0);
  expect(msg.react.mock.calls[0][0]).toBe('🤔');
});

// Query cases------------------------------------------------------------------
const qc = [
  {n: 'performs disordered queries', i: 'kyrie  <@30422>   mash', o: 'Mash Kyrielight', c: '#442d39'},
  {n: 'performs partial name queries', i: ' <@30422> jeanne alter ', o: 'Jeanne d\'Arc (Alter) (Avenger)', c: '#091f3f'},
  {n: 'performs class plus name queries', i: '  <@30422> lancer jeanne', o: 'Jeanne d\'Arc Alter Santa Lily', c: '#eab6ba'},
  {n: 'performs class queries', i: '<@30422> foreigner  ', o: 'Katsushika Hokusai (Foreigner)', c: '#453356'},
  {n: 'performs prefix queries', i: '<@0> nobu arch', o: 'Oda Nobunaga (Archer)', c: '#f8f5f1'},
  {n: 'performs autocorrect on queries', i: '<@0> atria pendrgon', o: 'Altria Pendragon', c: '#4c5988'},
  {n: 'performs best match queries', i: '<@0> bb', o: 'BB', c: '#8f4b2f'},
  {n: 'performs suffix queries', i: '<@0> hime', o: 'Osakabe-Hime (Assassin)', c: '#eecab5'},
  {n: 'performs modifier queries', i: '<@0> saber lily', o: 'Altria Pendragon (Lily)', c: '#e6e3d8'},
  {n: 'performs beast queries', i: '<@90> beast l', o: 'Beast III/L', c: '#151227'},
  {n: 'performs autocorrect on modifier queries', i: '<@0> jalter lily', o: 'Jeanne d\'Arc Alter Santa Lily', c: '#eab6ba'},
  {n: 'defaults to lesser ID for same names', i: '<@50> solomon', o: 'Solomon', c: '#251326'},
  {n: 'performs ID search', i: '<@50> solomon 152', o: 'Solomon', c: '#35313c'}
];
for (const c of qc) {
  test(c.n, done => {
    const msg = {
      content: c.i,
      isMentioned: user => user.username === 'Moon Cell',
      react: jest.fn(),
      reply: o => {
        expect(msg.react.mock.calls.length).toBe(0);
        expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
        expect(o.embed.data.author).toBe(c.o);
        expect(o.embed.data.color).toBe(c.c);
        expect(o.embed.data.Skills).toBeTruthy();
        done();
      }
    };
    sendMsg(msg);
  });
}

// Summon cases-----------------------------------------------------------------
const sc = [
  {rng: 0.00007, i: '  <@57033925475>  ', r: '0'},
  {rng: 0.22, i: '<@57033925475> ', r: '1'},
  {rng: 0.5, i: '  <@000000>', r: '2'},
  {rng: 0.75, i: '<@000000>', r: '3'},
  {rng: 0.98, i: '  <@0xDEAD>', r: '4'},
  {rng: 0.999, i: '<@>', r: '5'}
];
for (const c of sc) {
  const mockRng = c.rng;
  test(`summons ${c.r}* servants`, done => {
    jest.mock('math-random', () => () => mockRng);
    const msg = {
      content: c.i,
      isMentioned: user => user.username === 'Moon Cell',
      react: jest.fn(),
      reply: o => {
        expect(msg.react.mock.calls.length).toBe(0);
        expect(fs.statSync(o.embed.data.file).isFile()).toBe(true);
        expect(o.embed.data.description).toMatch(`${c.r}:`);
        expect(o.embed.data.color).toMatch(/#[0-9a-f]{6}/);
        done();
      }
    };
    sendMsg(msg);
  });
}
