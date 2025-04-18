import { ZodIssue } from 'zod';

export type ValidationError = {
	validationErrors: ZodIssue[];
};
