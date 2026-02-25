import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSourceComponent } from './help-source.component';

describe('HelpSourceComponent', () => {
  let component: HelpSourceComponent;
  let fixture: ComponentFixture<HelpSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
