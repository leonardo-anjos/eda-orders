import request from 'supertest';
import app from '../src/app';

describe('order-service', () => {
  it('should be create a order and returns 201', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        userId: '123',
        items: ['pen', 'book'],
        total: 99.9
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('created');
  });
});
