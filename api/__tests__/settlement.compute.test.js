// api/__tests__/settlement.compute.test.js
const Svc = require('../services/settlement.service').computeOptimal;
const BalanceSvc = require('../services/balance.service');

describe('computeOptimal transfers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('simple case: one debtor, one creditor', async () => {
    jest.spyOn(BalanceSvc, 'getBalances').mockResolvedValue({
      U1: -30,
      U2:  30,
    });

    const result = await Svc('anyGroup');
    expect(result).toEqual([
      { from: 'U1', to: 'U2', amount: 30 },
    ]);
  });

  test('multiple debtors to one creditor', async () => {
    jest.spyOn(BalanceSvc, 'getBalances').mockResolvedValue({
      A: -50,
      B: -50,
      C: 100,
    });

    const result = await Svc('g1');
    expect(result).toEqual([
      { from: 'A', to: 'C', amount: 50 },
      { from: 'B', to: 'C', amount: 50 },
    ]);
  });

  test('rounding edge-case; drift sums to zero', async () => {
    jest.spyOn(BalanceSvc, 'getBalances').mockResolvedValue({
      D: -33.333,
      E:  33.333,
    });

    const result = await Svc('g2');
    // amounts are rounded to two decimals
    expect(result).toEqual([
      { from: 'D', to: 'E', amount: 33.33 },
    ]);
  });
});
