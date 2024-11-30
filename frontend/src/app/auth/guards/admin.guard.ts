import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'app/services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const isAdmin = inject(UserService).currentUser.isAdmin;
  const router = inject(Router);

  if (isAdmin) return true;

  router.navigate([
    '/not-found',
    {
      visible: true,
      resetLinkRoute: '/dashboard',
      resetLinkText: 'Go to Dashboard',
      notFoundMessage: "You don't have access to this page",
    },
  ]);

  return false;
};
