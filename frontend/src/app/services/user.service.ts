import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { HttpClient } from '@angular/common/http';
import {
  USER_GETALL_URL,
  USER_GETBYID_URL,
  USER_LOGIN_URL,
  USER_PASSWORD_UPDATE_URL,
  USER_REGISTER_URL,
  USER_TOGGLEBLOCK_URL,
  USER_UPDATE_PROFILE_URL,
  USER_UPDATE_URL,
} from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserProfile } from 'app/shared/interfaces/IUserProfile';
import { IUserPassword } from 'app/shared/interfaces/IUserPassword';
import { IUserEdit } from 'app/shared/interfaces/IUserEdit';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage(),
  );
  public userObsevable: Observable<User>;

  constructor(
    private http: HttpClient,
    private toastService: ToastrService,
  ) {
    this.userObsevable = this.userSubject.asObservable();
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserTotLocalStorage(user);
          this.userSubject.next(user);
          console.log('user', user);

          this.toastService.success(
            `Welcome to Foodmin ${user.name}!`,
            'Login Successful',
          );
        },
        error: (errorResponse) => {
          this.toastService.error(errorResponse.error, 'Login Failed');
        },
      }),
    );
  }

  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserTotLocalStorage(user);
          this.userSubject.next(user);
          this.toastService.success(
            `Welcom to the Foodmine ${user.name}`,
            'Register Successful',
          );
        },
        error: (errorResponse) =>
          this.toastService.error(errorResponse.error, 'Register Failed'),
      }),
    );
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  updateProfile(user: IUserProfile): Observable<User> {
    return this.http.put<User>(USER_UPDATE_PROFILE_URL, user).pipe(
      tap({
        next: (user) => {
          this.setUserTotLocalStorage(user);
          this.userSubject.next(user);
          this.toastService.success(
            `User profile updated`,
            'Updated Successful',
          );
        },
        error: (errorResponse) =>
          this.toastService.error(errorResponse, 'Update Failed'),
      }),
    );
  }

  changePassword(userPassword: IUserPassword) {
    this.http
      .put(USER_PASSWORD_UPDATE_URL, userPassword)
      .pipe(
        tap({
          next: () => {
            this.logout();
            this.toastService.success(
              'Password Changed Successfully, Please Login Again!',
              'Updated Successful',
            );
          },
          error: (errorResponse) =>
            this.toastService.error(errorResponse, 'Change Password Failed'),
        }),
      )
      .subscribe();
  }

  public getAll(searchTerm: string): Observable<User[]> {
    return this.http.get<User[]>(USER_GETALL_URL + (searchTerm ?? ''));
  }

  public toggleBlock(userId: string): Observable<boolean> {
    return this.http.put<boolean>(USER_TOGGLEBLOCK_URL + userId, {});
  }

  public getById(userId: string): Observable<User> {
    return this.http.get<User>(USER_GETBYID_URL + userId);
  }

  public updateUser(userData: IUserEdit) {
    return this.http.put(USER_UPDATE_URL, userData);
  }

  private setUserTotLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) return JSON.parse(userJson) as User;
    return new User();
  }
}
