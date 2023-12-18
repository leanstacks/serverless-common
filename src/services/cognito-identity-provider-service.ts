import {
  AdminDisableUserCommand,
  AdminDisableUserCommandInput,
  AdminDisableUserCommandOutput,
  AdminSetUserPasswordCommand,
  AdminSetUserPasswordCommandInput,
  AdminSetUserPasswordCommandOutput,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
  ListUsersCommand,
  ListUsersCommandInput,
  ListUsersCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';

import { lambdaConfigValues as config } from './config.service';

const clientConfig: CognitoIdentityProviderClientConfig = {
  region: config.AWS_REGION,
};

const cognitoClient = new CognitoIdentityProviderClient(clientConfig);

/**
 * Disables a user in an Amazon Cognito user pool.
 * @param input - An `AdminDisableUserCommandInput` object.
 * @returns A Promise which resolves to an `AdminDisableUserCommandOutput` object.
 */
const adminDisableUser = (
  input: AdminDisableUserCommandInput,
): Promise<AdminDisableUserCommandOutput> => {
  return cognitoClient.send(new AdminDisableUserCommand(input));
};

/**
 * Sets a user's password in an Amazon Cognito user pool.
 * @param input - An `AdminSetUserPasswordCommandInput` object.
 * @returns A Promise which resolves to an `AdminSetUserPasswordCommandOutput` object.
 */
const adminSetUserPassword = (
  input: AdminSetUserPasswordCommandInput,
): Promise<AdminSetUserPasswordCommandOutput> => {
  return cognitoClient.send(new AdminSetUserPasswordCommand(input));
};

/**
 * Lists users in an Amazon Cognito user pool. Accepts search criteria.
 * @param input - A `ListUsersCommandInput` object.
 * @returns A Promise which resolves to a `ListUsersCommandOutput` object.
 */
const listUsers = (input: ListUsersCommandInput): Promise<ListUsersCommandOutput> => {
  return cognitoClient.send(new ListUsersCommand(input));
};

/**
 * Use the `CognitoIdentityProviderService` to interact with Amazon Cognito.
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/ | Amazon Cognito Identity Provider}
 */
const CognitoIdentityProviderService = { adminDisableUser, adminSetUserPassword, listUsers };

export default CognitoIdentityProviderService;
