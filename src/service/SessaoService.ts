import { AxiosError } from "axios";
import { api } from "../api/api";
import Sessao from "../model/Sessao";

class SessaoService {

    buscarTodas() {

        return new Promise<Sessao[]>((resolve, reject): void => {
            let url = `/sessao/all`;
            api
                .get(url)
                .then(response => resolve(response.data))
                .catch((err: AxiosError) => reject(err.response));
        });

    }

    buscar(id: number) {

        return new Promise<Sessao>((resolve, reject): void => {
            api
                .get(`/sessao/${id}`)
                .then(response => resolve(response.data))
                .catch((err: AxiosError) => reject(err.response));
        });

    }

    salvar(sessao: Sessao) {
        return new Promise<Sessao>((resolve, reject): void => {
            api
                .post(`/sessao`, sessao)
                .then(response => resolve(response.data))
                .catch((err: AxiosError) => reject(err.response));
        });
    }

}

export default SessaoService;
