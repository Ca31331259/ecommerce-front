import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerEditor } from './banner-editor';

describe('BannerEditor', () => {
  let component: BannerEditor;
  let fixture: ComponentFixture<BannerEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
