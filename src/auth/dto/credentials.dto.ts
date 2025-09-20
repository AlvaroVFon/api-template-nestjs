import { Profile } from 'passport';

export type PasswordCredentials = {
  type: 'password';
  email: string;
  password: string;
};

export type GoogleCredentials = {
  type: 'google';
  accessToken: string;
  refreshToken: string;
  profile: Profile;
};

export type Credentials = PasswordCredentials | GoogleCredentials;
