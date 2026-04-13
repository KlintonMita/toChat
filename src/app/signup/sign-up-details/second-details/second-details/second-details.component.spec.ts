import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondDetailsComponent } from './second-details.component';

describe('SecondDetailsComponent', () => {
  let component: SecondDetailsComponent;
  let fixture: ComponentFixture<SecondDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecondDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
