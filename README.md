# TesteJurema

## Demos 

https://teste-jurema.firebaseapp.com

http://teste-jurema.herokuapp.com

## Por que dois links?
O do firebase funciona o pwa em um dispositivo movel, mas por ser um link ```https```, o navegador bloqueia a requisição ```http``` da API do Bolsa Familia, impossibilitando o carregamento do gráfico.

Daí eu fiz um link no heroku, por permitir ```http```, mas por algum motivo o serviceworker.js não tá funcionando,
impossibilitando o pwa.

Como eu quero mostrar as duas tecnicas, então disponibilizei os dois links

## Como instalar localmente
```npm install```

## Como rodar localmente
```npm install -g @angular/cli```

```ng serve```