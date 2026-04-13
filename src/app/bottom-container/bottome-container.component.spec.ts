import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomeContainerComponent } from './bottome-container.component';

describe('BottomeContainerComponent', () => {
  let component: BottomeContainerComponent;
  let fixture: ComponentFixture<BottomeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomeContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BottomeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
