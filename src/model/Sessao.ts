import Amostra from "./Amostra";
import MapaPalmilha from "./MapaPalmilha";
import Passada from "./Passada";

export default class Sessao {
    id: number|null;
    iniciadoEm: Date|null;
    finalizadoEm: Date|null;
    notas: string;
    amostras : Amostra[] = []
    passadas : Passada[] = []
    mapaPalmilha: MapaPalmilha | null;
    constructor(
        id: number|null=null,
        iniciadoEm: Date|null = new Date(),
        finalizadoEm: Date|null = null,
        notas: string = "",
        amostras = [],
        passadas = [],
        mapaPalmilha: MapaPalmilha | null = null
    ){
        this.id = id;
        this.iniciadoEm = iniciadoEm;
        this.finalizadoEm = finalizadoEm;
        this.notas = notas;
        this.amostras = amostras;
        this.passadas = passadas;
        this.mapaPalmilha = mapaPalmilha;
    }
}