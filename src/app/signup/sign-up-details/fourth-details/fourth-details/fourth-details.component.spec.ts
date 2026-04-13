import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthDetailsComponent } from './fourth-details.component';

describe('FourthDetailsComponent', () => {
  let component: FourthDetailsComponent;
  let fixture: ComponentFixture<FourthDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourthDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FourthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
