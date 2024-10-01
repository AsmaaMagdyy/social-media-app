import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavblankComponent } from './navblank.component';

describe('NavblankComponent', () => {
  let component: NavblankComponent;
  let fixture: ComponentFixture<NavblankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavblankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavblankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
