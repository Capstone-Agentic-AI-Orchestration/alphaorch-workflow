import request from 'supertest';

import { app, SERVICE_NAME } from '../../src/app';

describe('fixture-nodejs', () => {
  it('exports SERVICE_NAME', () => {
    expect(SERVICE_NAME).toBe('fixture-nodejs');
  });

  it('answers GET /health', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
