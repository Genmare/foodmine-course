import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { User } from 'app/shared/models/User';
import { TitleComponent } from '../../partials/title/title.component';
import { SearchComponent } from '../../partials/search/search.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [RouterLink, TitleComponent, SearchComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
})
export class UsersPageComponent {
  currentUser!: User;
  users: User[] = [];
  searchTerm = '';

  constructor(
    activatedRoute: ActivatedRoute,
    private userService: UserService,
  ) {
    this.currentUser = userService.currentUser;
    activatedRoute.params.subscribe(({ searchTerm }) => {
      this.searchTerm = searchTerm;
      userService
        .getAll(this.searchTerm)
        .subscribe((users) => (this.users = users));
    });
  }

  handleToggleBlock(userId: string) {
    this.userService.toggleBlock(userId).subscribe((isBlocked) => {
      this.users = this.users.map((user) =>
        user.id === userId ? { ...user, isBlocked } : user,
      );
    });
  }
}
