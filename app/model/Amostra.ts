import Sessao from "./Sessao";

export default class Amostra {
    id: number|null;
    sessao : Sessao | null;
    ts: Date;
    s1: number;
    s2: number;
    s3: number;
    s4: number;
    s5: number;
    s6: number;
    constructor(
        id: number|null = null,
        sessao: Sessao | null,
        ts: Date,
        s1: number,
        s2: number,
        s3: number,
        s4: number,
        s5: number,
        s6: number
    ){
        this.id = id;
        this.sessao = sessao;
        this.ts = ts;
        this.s1 = s1;
        this.s2 = s2;
        this.s3 = s3;
        this.s4 = s4;
        this.s5 = s5;
        this.s6 = s6;
    }
}