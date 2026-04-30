import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpDetailsComponent } from './sign-up-details.component';

describe('SignUpDetailsComponent', () => {
  let component: SignUpDetailsComponent;
  let fixture: ComponentFixture<SignUpDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignUpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
