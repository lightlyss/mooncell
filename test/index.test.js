const mooncell = require('..');

test('rolls the gacha', () => {
  const svt = mooncell.summon();
  const details = mooncell.getDetails(svt.id);
  expect(details.name).toBeDefined();
});

test('searches by name and class', () => {
  const svt = mooncell.search('archer alter');
  expect(svt.name).toBe('Emiya (Alter)');
  expect(svt.actives.length).toBe(3);
});

test('links skill and art details to servants', () => {
  const svt = mooncell.search('kingprotea');
  const details = mooncell.getDetails(svt.id);
  expect(details.name).toBe('Kingprotea');
  expect(details.actives.length).toBe(3);
  expect(details.passives.length).toBe(5);
  expect(details.np.effects.length).toBe(3);
  expect(details.splashes.length).toBe(4);
});

test('handles single-passive servants', () => {
  const svt = mooncell.search('jack');
  const details = mooncell.getDetails(svt.id);
  expect(details.name).toBe('Jack the Ripper');
  expect(details.actives.length).toBe(3);
  expect(details.passives.length).toBe(1);
  expect(details.passives[0].effects.length).toBe(1);
  expect(details.np.effects.length).toBe(2);
  expect(details.splashes.length).toBe(4);
});

test('handles no-passive servants', () => {
  const svt = mooncell.search('l  beast ');
  const details = mooncell.getDetails(svt.id);
  expect(details.name).toBe('Beast III/L');
  expect(details.actives.length).toBe(0);
  expect(details.passives.length).toBe(0);
  expect(details.np.effects.length).toBe(3);
  expect(details.splashes.length).toBe(4);
});

test('handles upgradable-active servants', () => {
  const svt = mooncell.search('kiara');
  const details = mooncell.getDetails(svt.id);
  expect(details.name).toBe('Sessyoin Kiara');
  expect(svt.actives.length).toBe(3);
  expect(details.actives.length).toBe(5);
  expect(svt.passives.length).toBe(4);
  expect(details.passives.length).toBe(4);
  expect(details.np.effects.length).toBe(3);
  expect(details.splashes.length).toBe(4);
});
