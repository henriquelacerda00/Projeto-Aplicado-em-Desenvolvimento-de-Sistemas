// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { provideHttpClient } from '@angular/common/http';
// import { TranslateLoader, TranslateService } from '@ngx-translate/core';
// import { provideTranslate } from './app/core/config/translate.provider';

// /**
//  * Função de bootstrap para Angular Universal
//  */
// export async function bootstrap() {
//   return bootstrapApplication(AppComponent, {
//     providers: [
//       provideHttpClient(),  // necessário para TranslateHttpLoader
//       ...provideTranslate(), // seu TranslateUniversalLoader
//       TranslateService,
//     ]
//   });
// }

// /**
//  * Reexporta como default para compatibilidade com Angular SSR
//  */
// export { bootstrap as default };
