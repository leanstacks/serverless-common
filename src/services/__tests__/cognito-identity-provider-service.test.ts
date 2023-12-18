import {
  AdminDisableUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

import CognitoIdentityProviderService from '../cognito-identity-provider-service';
import {
  adminDisableUserInputFixture,
  adminDisableUserOutputFixture,
  adminSetUserPasswordCommandInputFixture,
  adminSetUserPasswordCommandOutputFixture,
  listUsersCommandInputFixture,
  listUsersCommandOutputFixture,
} from '../../__fixtures__/cognito-identity-provider.fixture';

describe('CognitoIdentityProviderService', () => {
  it('should be defined', () => {
    expect(CognitoIdentityProviderService.adminDisableUser).toBeDefined();
  });

  it('should send AdminDisableUserCommand', async () => {
    const cognitoMock = mockClient(CognitoIdentityProviderClient);
    cognitoMock.on(AdminDisableUserCommand).resolves(adminDisableUserOutputFixture);

    const output = await CognitoIdentityProviderService.adminDisableUser(
      adminDisableUserInputFixture,
    );

    expect(output).toBeDefined();
    expect(output).toEqual(adminDisableUserOutputFixture);
    expect(cognitoMock).toHaveReceivedCommandWith(
      AdminDisableUserCommand,
      adminDisableUserInputFixture,
    );
  });

  it('should send AdminSetUserPasswordCommand', async () => {
    const cognitoMock = mockClient(CognitoIdentityProviderClient);
    cognitoMock.on(AdminSetUserPasswordCommand).resolves(adminSetUserPasswordCommandOutputFixture);

    const output = await CognitoIdentityProviderService.adminSetUserPassword(
      adminSetUserPasswordCommandInputFixture,
    );

    expect(output).toBeDefined();
    expect(output).toEqual(adminSetUserPasswordCommandOutputFixture);
    expect(cognitoMock).toHaveReceivedCommandWith(
      AdminSetUserPasswordCommand,
      adminSetUserPasswordCommandInputFixture,
    );
  });

  it('should send ListUsersCommand', async () => {
    const cognitoMock = mockClient(CognitoIdentityProviderClient);
    cognitoMock.on(ListUsersCommand).resolves(listUsersCommandOutputFixture);

    const output = await CognitoIdentityProviderService.listUsers(listUsersCommandInputFixture);

    expect(output).toBeDefined();
    expect(output).toEqual(listUsersCommandOutputFixture);
    expect(cognitoMock).toHaveReceivedCommandWith(ListUsersCommand, listUsersCommandInputFixture);
  });
});
