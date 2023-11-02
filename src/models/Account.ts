export type Account = {
  username: string;
  createdAt: Date;
  isLocked: boolean;
};

export type UploadProfilePictureResponse = {
  url: string;
};
