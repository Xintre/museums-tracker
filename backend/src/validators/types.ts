import { ZodIssue } from 'zod';

export type ValidationError = {
	validationErrors: ZodIssue[];
};

export type NominatimError = {
	error: string;
};
