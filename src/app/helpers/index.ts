export module Helpers { 
  
    /**
     * Ordena em ordem alfabetica
     * @param data Dados
     * @param attr Atributo que deve ser comparado para ordenação
     * @return {any[]} Array
     */
    export function alphabeticOrder(data: []): []{

        data.sort( (a:[], b:[]) => {
            a = a['nome'].toLowerCase();
            b = b['nome'].toLowerCase();

            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            // a deve ser igual a b
            return 0;
        })

        return data;
    }
}