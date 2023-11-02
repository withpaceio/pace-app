import { object, string } from 'yup';

export const PasswordSaltSchema = object().shape({
  email: string().email('Invalid email').required('Email is required'),
});

export type PasswordSaltResponse = {
  passwordHashSalt: string;
  passwordTokenSalt: string;
  srpSalt: string;
  ephemeral: string;
};
