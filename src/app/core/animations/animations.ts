import { trigger, transition, style, animate, keyframes } from '@angular/animations';

export const highlightBorder = trigger('highlightBorder', [
  transition('* => *', [
    animate(
      '2s ease-in-out',
      keyframes([
        style({
          borderRadius: '8px',
          boxShadow: '0 0 0px rgba(33,150,243,0)',
          offset: 0
        }),
        style({
          borderRadius: '8px',
          boxShadow: '0 0 12px 4px rgba(15, 112, 192, 0.9)',
          offset: 0.15
        }),
        style({
          borderRadius: '8px',
          boxShadow: '0 0 0px rgba(33,150,243,0)',
          offset: 0.30
        }),
        style({
          borderRadius: '8px',
          boxShadow: '0 0 12px 4px rgba(15, 112, 192, 0.9)',
          offset: 0.45
        }),
        style({
          borderRadius: '8px',
          boxShadow: '0 0 0px rgba(33,150,243,0)',
          offset: 0.60
        }),
        style({
          borderRadius: '8px',
          boxShadow: '0 0 12px 4px rgba(15, 112, 192, 0.9)',
          offset: 0.75
        }),
        style({
          borderRadius: '8px',
          boxShadow: '0 0 0px rgba(33,150,243,0)',
          offset: 1
        })
      ])
    )
  ])
]);