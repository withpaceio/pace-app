import { AuthAction as AuthActionImported, AuthProvider, useAuth } from './AuthContext';
import changePassword from './changePassword';
import decryptHealthInformation from './decryptHealthInformation';
import decryptMeasurement from './decryptMeasurement';
import decryptProfilePicture from './decryptProfilePicture';
import encryptHealthInformation from './encryptHealthInformation';
import encryptMeasurement from './encryptMeasurement';
import encryptProfilePicture from './encryptProfilePicture';
import generateProfile from './generateProfile';
import loadHealthInformation from './loadHealthInformation';
import { decryptProfileData, encryptProfileData } from './profileData';
import saveHealthInformation from './saveHealthInformation';
import signIn from './signin';
import signOut from './signout';
import signUp from './signup';
import { deleteProfile, loadProfile, saveProfile } from './storage';
import type { ProfileData as ProfileDataImported, Profile as ProfileImported } from './types';

export type AuthAction = AuthActionImported;
export type Profile = ProfileImported;
export type ProfileData = ProfileDataImported;

export {
  AuthProvider,
  useAuth,
  changePassword,
  decryptHealthInformation,
  decryptMeasurement,
  decryptProfileData,
  decryptProfilePicture,
  encryptHealthInformation,
  encryptMeasurement,
  encryptProfileData,
  encryptProfilePicture,
  generateProfile,
  loadHealthInformation,
  signIn,
  signOut,
  signUp,
  saveHealthInformation,
  saveProfile,
  loadProfile,
  deleteProfile,
};
