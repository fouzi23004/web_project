import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { ModalService } from '../../services/modal.service';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display alert modal', () => {
    modalService.alert('Test Title', 'Test Message');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.modal-header h2')?.textContent).toContain('Test Title');
    expect(compiled.querySelector('.modal-body p')?.textContent).toContain('Test Message');
  });

  it('should display confirm modal with two buttons', () => {
    modalService.confirm('Confirm Title', 'Confirm Message');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.modal-footer button');
    expect(buttons.length).toBe(2);
  });

  it('should display prompt modal with input field', () => {
    modalService.prompt('Prompt Title', 'Prompt Message', 'Placeholder', 'Default');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.modal-input');
    expect(input).toBeTruthy();
    expect(input.value).toBe('Default');
  });
});
