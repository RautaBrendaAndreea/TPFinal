import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.username.trim() === '' || this.password.trim() === '') {
      console.error('Veuillez saisir un nom d\'utilisateur et un mot de passe.');
      return;
    }

    this.authService.login(this.username, this.password).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Erreur lors de la connexion :', error);
      }
    );
  }
}
