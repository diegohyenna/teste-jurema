import { TestBed } from '@angular/core/testing';

import { BolsaFamiliaService } from './bolsa-familia.service';

describe('BolsaFamiliaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BolsaFamiliaService = TestBed.get(BolsaFamiliaService);
    expect(service).toBeTruthy();
  });
});
