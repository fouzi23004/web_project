import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface ModalConfig {
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  inputPlaceholder?: string;
  inputValue?: string;
}

export interface ModalResult {
  confirmed: boolean;
  value?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
  private resultSubject = new Subject<ModalResult>();

  modal$ = this.modalSubject.asObservable();
  result$ = this.resultSubject.asObservable();

  alert(title: string, message: string): Promise<void> {
    return new Promise((resolve) => {
      this.modalSubject.next({
        type: 'alert',
        title,
        message,
        confirmText: 'OK'
      });

      const subscription = this.result$.subscribe(() => {
        subscription.unsubscribe();
        resolve();
      });
    });
  }

  confirm(title: string, message: string, confirmText: string = 'Confirmer', cancelText: string = 'Annuler'): Promise<boolean> {
    return new Promise((resolve) => {
      this.modalSubject.next({
        type: 'confirm',
        title,
        message,
        confirmText,
        cancelText
      });

      const subscription = this.result$.subscribe((result) => {
        subscription.unsubscribe();
        resolve(result.confirmed);
      });
    });
  }

  prompt(title: string, message: string, inputPlaceholder: string = '', inputValue: string = ''): Promise<string | null> {
    return new Promise((resolve) => {
      this.modalSubject.next({
        type: 'prompt',
        title,
        message,
        inputPlaceholder,
        inputValue,
        confirmText: 'OK',
        cancelText: 'Annuler'
      });

      const subscription = this.result$.subscribe((result) => {
        subscription.unsubscribe();
        resolve(result.confirmed ? result.value || '' : null);
      });
    });
  }

  close(result: ModalResult) {
    this.modalSubject.next(null);
    this.resultSubject.next(result);
  }

  closeModal() {
    this.modalSubject.next(null);
  }
}
