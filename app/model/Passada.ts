import PassadaSensor from "./PassadaSensor";
import Sessao from "./Sessao";
export default class Passada {
    id: number|null;
    sessao : Sessao | null;
    idx: number;
    inicio: Date;
    fim: Date;
    contatoMs: number;
    contatoInicial: string;
    picoTotal: number;
    razaoMedial: number;
    itens : PassadaSensor[] = []
    constructor(
        id: number|null=null,
        sessao: Sessao | null,
        idx: number,
        inicio: Date,
        fim: Date,
        contatoMs: number,
        contatoInicial: string,
        picoTotal: number,
        razaoMedial: number,
        itens = []
    ){
        this.id = id;
        this.sessao = sessao;
        this.idx = idx;
        this.inicio = inicio;
        this.fim = fim;
        this.contatoMs = contatoMs;
        this.contatoInicial = contatoInicial;
        this.picoTotal = picoTotal;
        this.razaoMedial = razaoMedial;
        this.itens = itens;
    }
}