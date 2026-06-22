import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';
import lottie from 'lottie-web';
import { AuthService } from '../../core/hml-services/auth.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './call-back.component.html',
  styleUrls: ['./call-back.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  @ViewChild('lottieContainer', { static: true })
  container!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private ngZone: NgZone,
    public loadingService: LoadingService
  ) { }

  async ngOnInit() {

    lottie.loadAnimation({
      container: this.container.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/coffe-orange.json'
    });

    try {

      const token =
        this.route.snapshot.queryParamMap.get('token');

      if (!token) {

        this.notification.error(
          'Token inválido.'
        );

        await this.router.navigate(['/login']);

        return;
      }

      await this.authService.confirmEmail(token);

      await new Promise(resolve =>
        setTimeout(resolve, 3000)
      );

      this.ngZone.run(async () => {

        this.notification.success(
          'Email confirmado com sucesso!'
        );

        await this.router.navigate(['/login']);
      });

    } catch (err: any) {

      console.error(err);

      this.notification.error(
        err?.error?.message ||
        err?.message ||
        'Erro ao confirmar email.'
      );

      await this.router.navigate(['/login']);

    } finally {

      this.loadingService.hide();
    }
  }
}