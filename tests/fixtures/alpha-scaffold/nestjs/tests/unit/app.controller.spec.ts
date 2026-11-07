import { Test } from '@nestjs/testing';

import { AppController } from '../../src/app.controller';

describe('AppController', () => {
  it('answers GET /health', async () => {
    const moduleRef = await Test.createTestingModule({ controllers: [AppController] }).compile();
    const controller = moduleRef.get(AppController);

    expect(controller.health()).toEqual({ status: 'ok' });
  });
});
