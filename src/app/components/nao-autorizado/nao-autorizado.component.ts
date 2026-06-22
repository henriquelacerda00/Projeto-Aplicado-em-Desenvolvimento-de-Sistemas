import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import lottie, { AnimationItem } from 'lottie-web';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-nao-autorizado',
  imports: [CommonModule,MaterialModule,RouterLink],
  templateUrl: './nao-autorizado.component.html',
  styleUrl: './nao-autorizado.component.scss'
})
export class NaoAutorizadoComponent implements OnInit {

  @ViewChild('lottieContainer', { static: true })
  container!: ElementRef;

  animation!: AnimationItem;

  ngOnInit(): void {

    this.animation = lottie.loadAnimation({
      container: this.container.nativeElement,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: '/assets/unauthorized.json'
    });

    this.animation.setSpeed(0.5);
  }
}

