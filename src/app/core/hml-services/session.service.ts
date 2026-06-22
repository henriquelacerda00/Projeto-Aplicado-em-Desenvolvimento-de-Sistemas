import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private api =
    'http://localhost:8080/sessions';

  constructor(
    private http: HttpClient
  ) {}

  async acceptInvite(
    inviteToken: string
  ) {

    return await firstValueFrom(

      this.http.post(
        `${this.api}/accept-invite`,
        {
          inviteToken
        }
      )
    );
  }

  async createSession(payload: any) {
    return firstValueFrom(
      this.http.post(`${this.api}/cadastrar-sessao`, payload)
    );
  }


}
