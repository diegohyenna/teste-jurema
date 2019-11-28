import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BolsaFamiliaService {

  /**
   * Url Base do Service
   */
  private url: string;

  constructor() { 
    this.url = "http://www.transparencia.gov.br/api-de-dados/bolsa-familia-por-municipio";
  }

  /**
   * Obtem os dados do bolsa familia por ano e mes e cidade
   * @param {string} yearMonth ano e mes de consulta 'AAAA/MM'
   * @param {string} ibgeCode Id da cidade obtido pelo ibge
   * @param {string} page Numero da pagina
   * @return {Promise[]} Promise Array 
   */
  getByMonth(monthAno, ibgeCode, page): Promise<[]>{

    let url = new URL(this.url);    
    let params = {mesAno: monthAno, codigoIbge: ibgeCode, pagina: page }

    Object.keys(params).forEach(
      key => url.searchParams.append(key, params[key])
    )

    return fetch(url.href)
      .then( res =>
        res.json()
      )
      .catch( err => 
        []
      )
  }

  /**
   * Obtem os dados do bolsa familia por ano e cidade
   * @param {string} year Ano de consulta 'AAAA' 
   * @param {string} ibgeCode Id da cidade obtido pelo ibge
   * @param {string} page Numero da pagina
   * @return {Promise<any>} Promise Arrays 
   */
  getByYear(year, ibgeCode, page): Promise<any>{

    let tasks = [];
    let month;
    let yearMonth;

    for(let i=0; i<12; i++){
      month = ("00" + (i+1)).slice(-2);
      yearMonth = (year+month);          
      tasks.push(this.getByMonth(yearMonth, ibgeCode, page));      
    }
   
    return Promise.all(tasks)
      .then(res => 
        res
      )
      .catch( err => 
        []
      )  
  }
}
