interface User {
  permissions: string[];
  roles: string[];
}

interface ValidateUserPermissionsParams {
  user: User;
  permissions?: string[];
  roles?: string[];
}

export function validateUserPermissions({
  user,
  permissions,
  roles,
}: ValidateUserPermissionsParams) {
  if (permissions?.length) {
    const hasAllPermissions = permissions.every(permission =>
      user.permissions.includes(permission)
    );

    if (!hasAllPermissions) return false;
  }

  if (roles?.length) {
    const hasAllRoles = roles.some(role => user.roles.includes(role));

    if (!hasAllRoles) return false;
  }

  return true;
}
