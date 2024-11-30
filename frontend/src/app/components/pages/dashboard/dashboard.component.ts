import { NgFor, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { User } from 'app/shared/models/User';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgStyle],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user!: User;
  resetLinkRoute = '/';

  constructor(userService: UserService) {
    this.user = userService.currentUser;
  }

  allItems = [
    {
      title: 'Orders',
      imageUrl: 'assets/icons/orders.svg',
      url: '/orders',
      bgColor: '#ec407a',
      color: 'white',
    },
    {
      title: 'Profile',
      imageUrl: 'assets/icons/profile.svg',
      url: '/profile',
      bgColor: '#1565c0',
      color: 'white',
    },
    {
      title: 'Users',
      imageUrl: 'assets/icons/users.svg',
      url: '/admin/users',
      forAdmin: true,
      bgColor: '#00bfa5',
      color: 'white',
    },
    {
      title: 'Foods',
      imageUrl: 'assets/icons/foods.svg',
      url: '/admin/foods',
      forAdmin: true,
      bgColor: '#e040fb',
      color: 'white',
    },
  ];
}
