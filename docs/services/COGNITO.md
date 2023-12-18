:house: [Home](/README.md) | :books: [Docs](../DOCS.md)

# Cognito Identity Provider Client Service

This document describes how to use the Cognito Identity Provider service component, `CognitoIdentityProviderService`, to interact with Amazon Cognito.

## How it works

The AWS SDK provides components which facilitate operations on Amazon Cognito. These components must be configured and instantiated before use. This boilerplate setup logic is encapsulated within the `CognitoIdentityProviderService` component.

## Using `CognitoIdentityProviderService`

The `CognitoIdentityProviderService` wraps the `CognitoIdentityProviderClient` from the AWS SDK, exposing the functions which you need to interact with Amazon Cognito. Those functions include:

- adminDisableUser
- adminSetUserPassword
- listUsers

`CognitoIdentityProviderService` leverages the family of `CommandInput` types from the AWS SDK for the function parameters and return types. For example, the signature of the `listUsers` function is:

```ts
listUsers(input: ListUsersCommandInput): Promise<ListUsersCommandOutput>
```

For more information about the CommandInput and CommandOutput objects see the [`@aws-sdk/client-cognito-identity-provider`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/) official documentation.

The example below illustrates one way to search the users in a Cognito User Pool.

First, we import the `CognitoIdentityProviderService`. `CognitoIdentityProviderService` is optimized for performance. It is configured once, the first time the module is imported. On subsequent uses, the module loader provides the pre-configured service.

```ts
import { CognitoIdentityProviderService } from '@leanstacks/serverless-common';
```

Then the service is used to search the Amazon Cognito User Pool.

```ts
const listUsersByUsername = async (username: string): Promise<User[]> => {
  const output = await CognitoIdentityProviderService.listUsers({
    UserPoolId: config.USER_POOL_ID,
    Limit: 10,
    Filter: `username=${username}`,
  });

  return output.Users;
};
```

Notice the shape of the input object to the `listUsers` function is the `ListUsersCommandInput` from the AWS SDK. Furthermore, the shape of the returned object is the `ListUsersCommandOutput`.

## Performance considerations

The Amazon Cognito components are constructed and configured once, when the `CognitoIdentityProviderService` module is first loaded by the module loader. If `CognitoIdentityProviderService` is used multiple times in a single function invocation, the previously instantiated and configured components are reused. Furthermore, the components are preserved between function invocations needing only to be created once during a Lambda function cold start.
