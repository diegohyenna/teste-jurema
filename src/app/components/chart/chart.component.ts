import { Component, OnInit } from '@angular/core';
import 'apexcharts';
import { BolsaFamiliaService } from '../../services/bolsa-familia.service';
import { IbgeService } from '../../services/ibge.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnInit {

  public loading: boolean;
  public states;
  public cities;
  public errors;
  public chart;

  constructor(
    private bolsaFamiliaService: BolsaFamiliaService,
    private ibgeService: IbgeService
  ) {
    ibgeService.getStates()
      .then(res => {
        res.sort(function (a, b) {
          if (a.nome < b.nome) {
            return -1;
          }
          if (a.nome > b.nome) {
            return 1;
          }
          // a deve ser igual a b
          return 0;
        })

        this.states = res;
      })
  }

  ngOnInit() {

  }

  onSelected(event) {
    
    this.loading = true;

    this.ibgeService.getCitiesByState(event.target.value)
      .then(res => {
        res.sort(function (a, b) {
          if (a.nome < b.nome) {
            return -1;
          }
          if (a.nome > b.nome) {
            return 1;
          }
          // a deve ser igual a b
          return 0;
        })

        this.cities = res;
        this.loading = false;
      })
  }

  onChartSearch(event){
    
    this.loading = true;
    this.chart ? this.chart.destroy() : "";

    this.bolsaFamiliaService.getByYear('2019', 2927408, '1')
      .then(res => {

        let values = [];
        let beneficiaries = [];

        res.map(items => {
          items[0] ? values.push(items[0].valor) : "";
          items[0] ? beneficiaries.push(items[0].quantidadeBeneficiados) : "";
        })

        this.drawChart(values, beneficiaries);

        this.loading = false;
      })
      .catch(err => {
        this.errors['message'] = "Hoveu algum erro ao tentar carregar o gráfico!"
      })
  }

  drawChart(values, beneficiaries) {

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

}
