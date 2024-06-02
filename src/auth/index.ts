import { AuthAction as AuthActionImported, AuthProvider, useAuth } from './AuthContext';
import changePassword from './changePassword';
import decryptHealthInformation from './decryptHealthInformation';
import decryptMeasurement from './decryptMeasurement';
import decryptProfileData from './decryptProfileData';
import decryptProfilePicture from './decryptProfilePicture';
import encryptHealthInformation from './encryptHealthInformation';
import encryptMeasurement from './encryptMeasurement';
import encryptProfileData from './encryptProfileData';
import encryptProfilePicture from './encryptProfilePicture';
import generateProfile from './generateProfile';
import loadHealthInformation from './loadHealthInformation';
import saveHealthInformation from './saveHealthInformation';
import signIn from './signin';
import signOut from './signout';
import signUp from './signup';
import { Profile as ProfileImported, deleteProfile, loadProfile, saveProfile } from './storage';
import { ProfileData as ProfileDataImported } from './types';

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
