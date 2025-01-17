import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarOutComponent } from './navbar-out.component';

describe('NavbarOutComponent', () => {
  let component: NavbarOutComponent;
  let fixture: ComponentFixture<NavbarOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
