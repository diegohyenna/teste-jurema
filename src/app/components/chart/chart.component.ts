import { Component, OnInit } from '@angular/core';
import 'apexcharts';
import { BolsaFamiliaService } from '../../services/bolsa-familia.service';
import { IbgeService } from '../../services/ibge.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { Helpers } from '../../helpers';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnInit {

  public loading: boolean;

  public errors = {
    message: null
  };
  
  //grafico
  public chart;

  //selects
  public states;
  public cities;
  public years;

  //forms
  public yearsForm: FormGroup;
  public cepForm: FormGroup;

  //estados dos selects
  public status = {
    state: '',
    city: '',
    year: ''
  }

  constructor(
    private bolsaFamiliaService: BolsaFamiliaService,
    private ibgeService: IbgeService,
    private formBuilder: FormBuilder
  ) {

    //popula o select de estado
    this.statesInit()

    //popula o select de anos
    this.yearsInit();

    //seta valor inicial ao select de anos
    this.yearsForm = this.formBuilder.group({
      years: ""
    })

    //seta valores iniciais aos selects estados e cidades
    this.cepForm = this.formBuilder.group({
      states: "",
      cities: "",
    })
  }

  ngOnInit() {

  }

  /**
   * Inicializa o select de estados
   */
  statesInit() {
    this.ibgeService.getStates()
      .then(res => {
        if (res.length != 0) {
          res = Helpers.alphabeticOrder(res)

          this.states = res;
        } else {
          this.errors.message = "Não foi possível carregar os estados!"
        }
      })
      .catch(err => {
        this.errors.message = "Hoveu algum erro ao tentar carregar os estados!"
      })
  }

  /**
   * Inicializa o select de cidades de acordo com o estado selecionado
   * @param {string} state - Id do estado
   */
  citiesInit(state: string){
    this.ibgeService.getCitiesByState(state)
      .then(res => {
        if (res.length != 0) {
          res = Helpers.alphabeticOrder(res);

          this.cities = res;
        } else {
          this.errors.message = "Não foi possível carregar as cidades!"
        }
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.errors.message = "Hoveu algum erro ao tentar carregar as cidades!"
      })
  }

  /**
   * Obtem o item selecionado do select estados e carrega os dados do bolsa familia
   * @param event Event HTML 
   */
  onSelectedState(event: any) {

    this.loading = true;

    this.chart ? this.chart.destroy() : "";
    this.chart = '';

    this.status.state = event.target.value;
    this.status.city = '';
    this.status.year = '';

    //retira a cidade que foi selecionada anteriormente
    this.cepForm.controls.cities.setValue(this.status.city);

    this.citiesInit(this.status.state);

  }

  /**
   * Obtem o item selecionado do select  cidades e carrega os dados do bolsa familia
   * @param event Event HTML 
   */
  onSelectedCity(event: any) {

    this.loading = true;

    this.chart ? this.chart.destroy() : "";
    this.chart = '';

    let now = new Date();

    this.status.city = event.target.value;
    this.status.year = '' + now.getFullYear();

    this.loadingBolsaFamilia(this.status.city, this.status.year)
  }

  /**
   * Obtem o item selecionado do select anos e carrega os dados do bolsa familia
   * @param event Event HTML
   */
  onSelectedYear(event: any) {
    this.loading = true;

    this.chart ? this.chart.destroy() : "";
    this.chart = '';

    this.status.year = event.target.value;

    this.loadingBolsaFamilia(this.status.city, this.status.year)
  }

  /**
   * Carrega dados do bolsa familia
   * @param {string} city Cidade
   * @param {string} year Ano
   */
  loadingBolsaFamilia(city: string, year: string) {

    //seta o ultimo ano selecionado
    this.yearsForm.controls.years.setValue(year);

    this.bolsaFamiliaService.getByYear(year, city, '1')
      .then(res => {
        if (res.length != 0) {
          let values = [];
          let beneficiaries = [];

          res.map(items => {
            items[0] ? values.push(items[0].valor) : "";
            items[0] ? beneficiaries.push(items[0].quantidadeBeneficiados) : "";
          })

          this.drawChart(values, beneficiaries);
        } else {
          this.errors.message = "Não existem dados para esse periodo ou não foi possível carregar o gráfico!"
        }
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.errors.message = "Hoveu algum erro ao tentar carregar o gráfico!"
      })
  }

  /**
   * Desenha o grafico na tela
   * @param {Array} values Array de Valores
   * @param {Array} beneficiaries Array de Beneficiarios
   */
  drawChart(values: any[], beneficiaries: any[]) {

    let options = {
      chart: {
        height: 350,
        width: '100%',
        type: 'line'
      },
      colors: ['#77B6EA', '#545454'],
      title: {
        text: 'Beneficiarios/Valores por mês',
        align: 'left'
      },
      series: [
        {
          name: 'Valores',
          data: values
        },
        {
          name: 'Beneficiarios',
          data: beneficiaries
        }
      ],
      grid: {
        row: {
          colors: ['#f3f3f3', '#ffffff'],
          opacity: 0.5
        },
      },
      markers: {
        size: 6
      },
      yaxis: {
        title: {
          text: 'Quantidade'
        }
      },
      xaxis: {
        title: {
          text: 'Meses'
        },
        categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      }
    }

    this.chart = new ApexCharts(document.getElementById("chart"), options);

    this.chart.render();
  }

  /**
  * Carrega o select de anos
  */
  yearsInit() {
    this.years = [
      {
        value: '2019'
      },
      {
        value: '2018'
      },
      {
        value: '2017'
      },
      {
        value: '2016'
      },
      {
        value: '2015'
      },
      {
        value: '2014'
      },
      {
        value: '2013'
      },
      {
        value: '2012'
      },
      {
        value: '2011'
      },
      {
        value: '2010'
      }
    ]
  }
}
