import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService, ModalConfig } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  modalConfig: ModalConfig | null = null;
  inputValue: string = '';

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.modal$.subscribe(config => {
      this.modalConfig = config;
      if (config?.type === 'prompt') {
        this.inputValue = config.inputValue || '';
      }
    });
  }

  onConfirm() {
    if (this.modalConfig?.type === 'prompt') {
      this.modalService.close({ confirmed: true, value: this.inputValue });
    } else {
      this.modalService.close({ confirmed: true });
    }
  }

  onCancel() {
    this.modalService.close({ confirmed: false });
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onCancel();
    }
  }
}
