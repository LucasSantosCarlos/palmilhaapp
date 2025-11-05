import { Buffer } from 'buffer';
import { Activity, BarChart3, Footprints } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { SessaoTab } from '../components/SessaoTab';
import Amostra from '../model/Amostra';
import Sessao from '../model/Sessao';
import { useTheme } from '../provider/ThemeProvider';
import SessaoService from '../service/SessaoService';
import { requestPermissions } from '../util/PermissaoUtil';
import MapaCalorTab from '../components/MapaCalorTab';

let connectedDevice: any = null;
let subscription: any = null;
let recvBuffer = ""; // <--- importante: escopo externo, não dentro do callback
let faseAtual = 0;
const sessaoService = new SessaoService();
export default function SessaoPage() {
    const { theme } = useTheme();
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isWatching, setIsWatching] = useState(false);
    const [amostrasWatched, setAmostrasWatched] = useState<Amostra[]>([]);
    const [sessao, setSessao] = useState<Sessao>(new Sessao());
    const [duration, setDuration] = useState(0);

    const [tabAtiva, setTabAtiva] = useState<"sessao" | "graficos" | "mapaCalor">('sessao');

    const handleSessionStart = async () => {
        setIsSessionActive(true);
        {/*requestPermissions().then(async granted => {
            if (granted) {
                await start();
            } else {
                console.log("Permissões não concedidas");
            }
        }).catch(error => {
            console.error("Erro ao solicitar permissões:", error);
        });*/}
        setSessao(new Sessao());
    };

    const handleSessionStop = () => {
        setIsSessionActive(false);
        stopReading();
        sessaoService.salvar({ ...sessao, finalizadoEm: new Date() }).then((savedSessao) => {
            setSessao(savedSessao);
            console.log(savedSessao)
        }).catch((error) => {
            console.error('Erro ao salvar sessão:', error);
        });
    };

    useEffect(() => {
        let interval: any;
        if (isSessionActive) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [isSessionActive]);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (!isWatching) return
            if( i >= sessao.amostras.length ) {
                setIsWatching(false);
                return;
            };

            setAmostrasWatched(prev => {
                if (i >= sessao.amostras.length) return prev;
                const updatedAmostras = [...prev, sessao.amostras[i]];
                i++;
                return updatedAmostras;
            });
        }, 500);
        return () => clearInterval(interval);
    }, [isWatching])


    //Aqui começa a simulação de dados
    const FASES = 4;
    function gerarAmostraDePasso(): Amostra {
        // valores base para cada fase
        const intensidade = (ativo: boolean) => ativo ? 60 + Math.random() * 40 : Math.random() * 10;

        let s1 = 0, s2 = 0, s3 = 0, s4 = 0, s5 = 0, s6 = 0;

        switch (faseAtual) {
            case 0: // calcanhar toca o chão
                s1 = intensidade(true);
                s2 = intensidade(true);
                s3 = intensidade(true) / 4;
                s4 = intensidade(true) / 4;
                s5 = intensidade(true) / 4;
                s6 = intensidade(true) / 4;
                break;
            case 1: // meio do pé
                s1 = intensidade(true) / 4;
                s2 = intensidade(true) / 4;
                s3 = intensidade(true);
                s4 = intensidade(true);
                s5 = intensidade(true) / 4;
                s6 = intensidade(true) / 4;
                break;
            case 2: // ponta do pé
                s1 = intensidade(true) / 4;
                s2 = intensidade(true) / 4;
                s3 = intensidade(true) / 4;
                s4 = intensidade(true) / 4;
                s5 = intensidade(true);
                s6 = intensidade(true);
                break;
            case 3: // pé no ar
                // tudo baixo
                break;
        }

        // próxima fase
        faseAtual = (faseAtual + 1) % FASES;

        return {
            id: null,
            sessao: null,
            ts: new Date(),
            s1, s2, s3, s4, s5, s6
        };
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isSessionActive) return

            const newData = gerarAmostraDePasso();
            setSessao(prev => {
                const updatedAmostras = [...prev.amostras, newData as Amostra];
                return { ...prev, amostras: updatedAmostras };
            });
        }, 500);
        return () => clearInterval(interval);
    }, [isSessionActive])
    //Aqui termina a simulação de dados

    const manager = new BleManager();

    const SERVICE_UUID = 'a62b7a2a-6f05-4b39-9a0c-3a0a4b6c1c10';
    const CHAR_JSON_UUID = 'b5e8c0f4-0a2a-47c7-9f83-0bcf3c5b1a11';

    async function start() {
        console.log("Iniciando scan de dispositivos BLE...");
        manager.startDeviceScan(null, null, async (err, dev) => {
            if (err) {
                console.error('Erro ao escanear dispositivos:', err);
                return;
            }

            if (dev?.name === 'PalmilhaESP32') {
                console.log('Dispositivo encontrado:', dev.name);
                manager.stopDeviceScan();

                try {
                    connectedDevice = await dev.connect();
                    console.log('Conectado:', connectedDevice.id);

                    // Tenta aumentar MTU (Android) — não garante sucesso, mas ajuda.
                    try {
                        if (connectedDevice.requestMTU) {
                            const mtu = await connectedDevice.requestMTU(256); // sugestão
                            console.log('MTU negociado:', mtu);
                        }
                    } catch (mtuErr) {
                        console.warn('Falha ao pedir MTU maior:', mtuErr);
                    }

                    await connectedDevice.discoverAllServicesAndCharacteristics();

                    // monitora característica
                    subscription = connectedDevice.monitorCharacteristicForService(
                        SERVICE_UUID,
                        CHAR_JSON_UUID,
                        (error: any, characteristic: any) => {
                            if (error) {
                                console.error('Erro no monitor:', error);
                                return;
                            }
                            if (!characteristic?.value) return;

                            // base64 -> Buffer -> string
                            const bytes = Buffer.from(characteristic.value, 'base64');

                            // DEBUG: mostra em HEX para entender fragmentação
                            const part = bytes.toString('utf8');

                            // acumula
                            recvBuffer += part;

                            // processa todas as mensagens completas separadas por '\n'
                            let newlineIndex;
                            while ((newlineIndex = recvBuffer.indexOf('\n')) !== -1) {
                                const line = recvBuffer.slice(0, newlineIndex).trim();
                                recvBuffer = recvBuffer.slice(newlineIndex + 1); // remove linha processada

                                if (!line) continue;

                                try {
                                    const obj = JSON.parse(line);
                                    // processa obj:
                                    const newData: Amostra = {
                                        id: null,
                                        sessao: null,
                                        s1: obj.pct[0],
                                        s2: obj.pct[1],
                                        s3: obj.pct[2],
                                        s4: obj.pct[3],
                                        s5: obj.pct[4],
                                        s6: obj.pct[5],
                                        ts: new Date(obj.t)
                                    };
                                    setSessao(prev => ({ ...prev, amostras: [...prev.amostras, newData] }));
                                } catch (e) {
                                    console.warn('JSON inválido após quebra por \\n:', e, 'conteúdo:', line);
                                    // opcional: aqui você pode decidir descartar line ou tentar esperar mais (mas já usamos \n como separador)
                                }
                            }

                            // Se você usa '}' como delimitador em vez de '\n', troque a lógica:
                            // se (recvBuffer.includes('}')) { ... }
                        }
                    );
                } catch (e) {
                    console.error('Erro durante conexão/descoberta:', e);
                }
            }
        });
    }

    function stopReading() {
        if (subscription) {
            subscription.remove();
            subscription = null;
        }
        if (connectedDevice) {
            manager.cancelDeviceConnection(connectedDevice.id)
                .then(() => console.log('Desconectado'))
                .catch(err => console.warn('Erro ao desconectar:', err));
            connectedDevice = null;
        }
        recvBuffer = "";
    }


    return (
        <ScrollView style={{ backgroundColor: theme.background, flex: 1, paddingTop: 16 }}>
            <View style={{ rowGap: 16 }}>
                <View style={{ alignItems: "center", marginTop: 16 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }} >
                        <Footprints color={theme.primary} size={48} />
                        <Text style={{ color: theme.blue700, fontSize: 16 }}>Análise de Pressão Plantar</Text>
                    </View>
                    <Text style={{ color: theme.blue500 }}>
                        Monitoramento em tempo real dos sensores de pressão
                    </Text>
                </View>

                <View style={{ paddingHorizontal: 8, rowGap: 16 }}>
                    <View style={{ flexDirection: "row", backgroundColor: theme.barGray, borderRadius: 20 }}>
                        <TouchableOpacity style={{ flexDirection: "row", flex: 1, backgroundColor: tabAtiva == "sessao" ? theme.boxBackground : "transparent", borderRadius: 20, alignItems: "center", justifyContent: "center", paddingVertical: 8 }} onPress={() => { setTabAtiva("sessao") }}>
                            <Activity color={theme.text} />
                            <Text style={{ color: theme.text }}>Sessão</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", flex: 1, backgroundColor: tabAtiva == "graficos" ? theme.boxBackground : "transparent", borderRadius: 20, alignItems: "center", justifyContent: "center", paddingVertical: 8 }} onPress={() => { setTabAtiva("graficos") }}>
                            <BarChart3 color={theme.text} />
                            <Text style={{ color: theme.text }}>Gráficos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: "row",
                            flex: 1,
                            backgroundColor: tabAtiva == "mapaCalor" ? theme.boxBackground : "transparent",
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingVertical: 8
                        }} onPress={() => { setTabAtiva("mapaCalor") }}>
                            <Footprints color={theme.text} />
                            <Text style={{ color: theme.text }}>Mapa de Calor</Text>
                        </TouchableOpacity>
                    </View>

                    {tabAtiva == "sessao" ? <SessaoTab
                        isActive={isSessionActive}
                        onStart={handleSessionStart}
                        onStop={handleSessionStop}
                        sessionData={isWatching ? amostrasWatched : sessao.amostras}
                        duration={duration}
                        watchable={sessao.finalizadoEm != null}
                        isWatching={isWatching}
                        onWatchStart={() => setIsWatching(true)}
                        onWatchStop={() => setIsWatching(false)}
                    /> : null}

                    {/*<TabsContent value="charts">
            <PressureCharts data={sessionData} isActive={isSessionActive} />
          </TabsContent>*/}
                    {tabAtiva == "mapaCalor" ?
                        <MapaCalorTab
                            isActive={isSessionActive}
                            onStart={handleSessionStart}
                            onStop={handleSessionStop}
                            sessionData={isWatching ? amostrasWatched : sessao.amostras} /> : null}
                </View>
            </View>
            <View style={{ marginTop: 20 }}></View>
        </ScrollView>
    );
}
