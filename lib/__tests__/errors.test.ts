import { describe, it, expect } from 'vitest';
import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
} from '@/lib/errors';

describe('AppError', () => {
  it('sets name, statusCode, and code', () => {
    const err = new AppError('Test error', 400, 'TEST_ERROR');
    expect(err.name).toBe('AppError');
    expect(err.message).toBe('Test error');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('TEST_ERROR');
  });
});

describe('UnauthorizedError', () => {
  it('has 401 status and UNAUTHORIZED code', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
    expect(err.message).toBe('Unauthorized');
  });

  it('accepts custom message', () => {
    const err = new UnauthorizedError('Invalid session');
    expect(err.message).toBe('Invalid session');
  });
});

describe('ForbiddenError', () => {
  it('has 403 status and FORBIDDEN code', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });
});

describe('NotFoundError', () => {
  it('has 404 status and NOT_FOUND code', () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
  });
});

describe('ConflictError', () => {
  it('has 409 status and CONFLICT code', () => {
    const err = new ConflictError();
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
  });
});

describe('ValidationError', () => {
  it('has 400 status and VALIDATION_ERROR code', () => {
    const err = new ValidationError();
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
  });
});
