import { SERVICE_NAME } from '../../src/index';

describe('fixture-nestjs', () => {
  it('exports SERVICE_NAME', () => {
    expect(SERVICE_NAME).toBe('fixture-nestjs');
  });
});
