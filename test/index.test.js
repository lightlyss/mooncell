const mooncell = require('..');

test('rolls the gacha', () => {
  const svt = mooncell.summon();
  expect(svt.id).toBeDefined();
});

test('searches by name and class', () => {
  const svt = mooncell.search('archer alter');
  expect(svt.name).toBe('Emiya (Alter)');
});

test('links skill and art details to servants', () => {
  const details = mooncell.getDetails('238');
  expect(details.name).toBe('Kingprotea');
  expect(details.actives.length).toBe(3);
  expect(details.passives.length).toBe(5);
  expect(details.np.effects.length).toBe(3);
  expect(details.splashes.length).toBe(4);
});

test('handles single-passive servants', () => {
  const details = mooncell.getDetails('75');
  expect(details.name).toBe('Jack the Ripper');
  expect(details.actives.length).toBe(3);
  expect(details.passives.length).toBe(1);
  expect(details.passives[0].effects.length).toBe(1);
  expect(details.np.effects.length).toBe(2);
  expect(details.splashes.length).toBe(4);
});

test('handles no-passive servants', () => {
  const details = mooncell.getDetails('240');
  expect(details.name).toBe('Beast III/L');
  expect(details.actives.length).toBe(0);
  expect(details.passives.length).toBe(0);
  expect(details.np.effects.length).toBe(3);
  expect(details.splashes.length).toBe(4);
});
