import {
  AdminDisableUserCommandInput,
  AdminDisableUserCommandOutput,
  AdminSetUserPasswordCommandInput,
  AdminSetUserPasswordCommandOutput,
  ListUsersCommandInput,
  ListUsersCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';

export const adminDisableUserInputFixture: AdminDisableUserCommandInput = {
  UserPoolId: 'user-pool-id',
  Username: 'username',
};

export const adminDisableUserOutputFixture: AdminDisableUserCommandOutput = { $metadata: {} };

export const adminSetUserPasswordCommandInputFixture: AdminSetUserPasswordCommandInput = {
  UserPoolId: 'user-pool-id',
  Username: 'username',
  Password: 'secret',
  Permanent: true,
};

export const adminSetUserPasswordCommandOutputFixture: AdminSetUserPasswordCommandOutput = {
  $metadata: {},
};

export const listUsersCommandInputFixture: ListUsersCommandInput = {
  UserPoolId: 'user-pool-id',
  Limit: 10,
  Filter: 'sub=123abc',
};

export const listUsersCommandOutputFixture: ListUsersCommandOutput = {
  $metadata: {},
  Users: [
    {
      Username: 'joe@example.com',
      Enabled: true,
    },
  ],
};
