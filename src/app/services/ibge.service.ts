import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IbgeService {

  /**
   * Url Base do Service
   */
  private url: string;

  constructor() { 
    this.url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
  }

  /**
   * Obtem todos os estados do brasil
   */
  getStates(){

    let url = new URL(this.url);    

    return fetch(url.href)
      .then( res =>
        res.json()
      )
      .catch( err => 
        []
      )
  }
  
  /**
   * Obtem todas as cidades de um estado
   * @param {string} idState Id do estado a ser pesquisado
   */
  getCitiesByState(idState){

    let url = new URL(`${this.url}/${idState}/municipios`);
    
    return fetch(url.href)
      .then( res =>
        res.json()
      )
      .catch( err => 
        []
      )
  }
}
