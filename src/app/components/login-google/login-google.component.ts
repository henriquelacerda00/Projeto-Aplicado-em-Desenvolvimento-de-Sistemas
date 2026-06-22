import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';


@Component({
  selector: 'app-login-google',
  imports: [MaterialModule],
  templateUrl: './login-google.component.html',
  styleUrl: './login-google.component.scss'
})
export class LoginGoogleComponent {

  @Input()label: string = '';

  loginGoogle(): void {
    console.log('Login with Google clicked!');
    // Implement Google login logic here
  }

}
