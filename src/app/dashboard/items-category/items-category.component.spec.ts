import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsCategoryComponent } from './items-category.component';

describe('ItemsCategoryComponent', () => {
  let component: ItemsCategoryComponent;
  let fixture: ComponentFixture<ItemsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
