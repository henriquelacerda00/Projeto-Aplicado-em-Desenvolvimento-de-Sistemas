import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MessageResponse } from '../types/type';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private environment = environment;


  private apiUrl = 'http://localhost:8080/auth';

  currentUser = signal<any | null>(null);

  userRole = signal<string | null>(null);

  constructor(
    private http: HttpClient
  ) {

    if (typeof window !== 'undefined') {

      const storedUser =
        localStorage.getItem('user');

      if (storedUser) {

        const user = JSON.parse(storedUser);

        this.currentUser.set(user);

        this.userRole.set(user.role);
      }
    }
  }

  async login(
    email: string,
    password: string
  ) {

    const response: any =
      await firstValueFrom(

        this.http.post(
          `${this.apiUrl}/login`,
          {
            email,
            password
          }
        )

      );

    localStorage.setItem(
      'token',
      response.token
    );

    await this.load();

    return response;
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {

    return await firstValueFrom(

      this.http.post(
        `${this.apiUrl}/register`,
        data
      )

    );
  }

  async me() {
    const token = localStorage.getItem('token');

    return await firstValueFrom(
      this.http.get(`${this.apiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    );
  }

  async load() {

    try {

      const user: any =
        await this.me();

      this.setUser(user);

    } catch (err) {

      this.logout();
    }
  }

  async isLoggedIn(): Promise<boolean> {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {

      await this.load();

      return true;

    } catch {

      return false;
    }
  }

  setUser(user: any) {

    this.currentUser.set(user);

    this.userRole.set(user.role);

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );
  }

  logout() {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    this.currentUser.set(null);

    this.userRole.set(null);
  }

  getToken(): string | null {

    return localStorage.getItem('token');
  }

  async confirmEmail(token: string) {
    return firstValueFrom(
      this.http.get<MessageResponse>(
        `${this.environment.apiUrl}/auth/confirm`,
        {
          params: { token }
        }
      )
    );
  }

}
