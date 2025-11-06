import Sessao from "./Sessao";

export default class MapaPalmilha {
    id: number|null;
    sessao : Sessao | null;
    sensorIdx: number;
    posicaoX: number
    posicaoY: number;
    
    constructor(
        id: number|null = null,
        sessao: Sessao | null,
        sensorIdx: number,
        posicaoX: number,
        posicaoY: number
    ){
        this.id = id;
        this.sessao = sessao;
        this.sensorIdx = sensorIdx;
        this.posicaoX = posicaoX;
        this.posicaoY = posicaoY;
    }
}