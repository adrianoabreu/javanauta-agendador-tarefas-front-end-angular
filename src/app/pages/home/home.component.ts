import { Component, inject } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { Route, Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [MatButton, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  imgHero = 'assets/imagem-hero.svg'

  // constructor(
    // private authService: AuthService,
    // private router: Router
  // ) { }

  private authService = inject(AuthService)
  private router = inject(Router)

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks'])
    }
  }
}
