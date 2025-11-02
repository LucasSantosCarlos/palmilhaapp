import Passada from "./Passada";

export default class PassadaSensor {
    id: number|null;
    passada : Passada | null;
    sensorIdx: number;
    media: number;
    pico: number;
    integral: number;
    constructor(
        id: number|null = null,
        passada: Passada | null,
        sensorIdx: number,
        media: number,
        pico: number,
        integral: number
    ){
        this.id = id;
        this.passada = passada;
        this.sensorIdx = sensorIdx;
        this.media = media;
        this.pico = pico;
        this.integral = integral;
    }
}