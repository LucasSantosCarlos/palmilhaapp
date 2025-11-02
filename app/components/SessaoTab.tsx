import { Activity, Clock, Play, Square } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Amostra from '../model/Amostra';
import { useTheme } from '../provider/ThemeProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface SessionControlProps {
    isActive: boolean;
    onStart: () => void;
    onStop: () => void;
    sessionData: Amostra[];
}

export function SessaoTab({ isActive, onStart, onStop, sessionData }: SessionControlProps) {
    const [duration, setDuration] = useState(0);
    const { theme } = useTheme();
    useEffect(() => {
        let interval: any;
        if (isActive) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const latestData = sessionData[sessionData.length - 1];

    return (
        <View style={{ flexDirection: "column", rowGap: 24 }}>
            <Card>
                <CardHeader>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flex: 1, flexShrink: 1}}>
                            <CardTitle>Controle de Sessão</CardTitle>
                            <CardDescription style={{ flexShrink: 1, fontSize: 14, color: theme.textGray }} >
                                Inicie uma nova sessão para começar a coletar dados dos sensores
                            </CardDescription>
                        </View>
                        <View style={{ padding: 8, borderRadius: 4, backgroundColor: isActive ?  theme.text : theme.barGray , flexDirection: "row", alignItems: "center", columnGap: 4 }}>
                            {isActive ? (
                                <>
                                    <Activity color={theme.background} />
                                    <Text style={{color: theme.background}}>Ativa</Text>
                                </>
                            ) : (
                                <Text style={{color: theme.text}}>Inativa</Text>
                            )}
                        </View>
                    </View>
                </CardHeader>
                <CardContent>
                    <View style={{ flexDirection: "column", rowGap: 24, alignItems: "center" }}>
                        <View style={{ flexDirection: "row", columnGap: 8, alignItems: "center" }}>
                            <Clock color={theme.primary} />
                            <Text style={{ color: theme.primary, fontSize: 24 }} >{formatDuration(duration)}</Text>
                        </View>

                        <View style={{ flexDirection: "row", columnGap: 16, justifyContent: "center" }}>
                            <TouchableOpacity
                                onPress={onStart}
                                disabled={isActive}
                                style={{ padding: 8, backgroundColor: isActive ? theme.green200 : theme.green700, borderRadius: 8, flexDirection: "row", columnGap: 8, alignItems: "center"}}
                            >
                                <Play color="white"/>
                                <Text style={{color: "white"}}>Iniciar Sessão</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onStop}
                                disabled={!isActive}
                                style={{ padding: 8, backgroundColor: isActive ? theme.red700 : theme.red200, borderRadius: 8, flexDirection: "row", columnGap: 8, alignItems: "center"}}
                            >
                                <Square color="white"/>
                                <Text style={{color: "white"}}>Parar Sessão</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Status dos Sensores</CardTitle>
                    <CardDescription>Leituras atuais de pressão (kPa)</CardDescription>
                </CardHeader>
                <CardContent>
                    <View style={{ flexDirection: 'column', rowGap: 16 }}>
                        {/* Calcanhar */}
                        <View>
                            <Text style={{ color: theme.textGray, marginBottom: 8 }}>Calcanhar</Text>
                            <View style={{ flexDirection: "row", columnGap: 16 }} >
                                <View style={{ flex: 1, backgroundColor: theme.blue50, borderRadius: 8, alignItems: "center", borderWidth: 2, borderColor: theme.blue200, paddingVertical: 20}}>
                                    <Text style={{color: theme.blue600}} >Interno</Text>
                                    <Text style={{color: theme.blue700, fontSize: 18}} >
                                        {latestData ? latestData.s2.toFixed(1) : '--'}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, backgroundColor: theme.blue100, borderRadius: 8, alignItems: "center", borderWidth: 2, borderColor: theme.blue300, paddingVertical: 20 }}>
                                    <Text style={{ color: theme.blue600 }}>Externo</Text>
                                    <Text style={{ color: theme.blue700, fontSize: 18 }}>
                                        {latestData ? latestData.s1.toFixed(1) : '--'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Médiopé */}
                        <View>
                            <Text style={{ color: theme.textGray, marginBottom: 8 }}>Médiopé</Text>
                            <View style={{ flexDirection: 'row', columnGap: 16 }}>
                                <View style={{ flex: 1, backgroundColor: theme.green50, borderRadius: 8, alignItems: "center", borderWidth: 2, borderColor: theme.green200, paddingVertical: 20 }}>
                                    <Text style={{ color: theme.green600 }}>Interno</Text>
                                    <Text style={{ color: theme.green700, fontSize: 18 }}>
                                        {latestData ? latestData.s4.toFixed(1) : '--'}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, backgroundColor: theme.green100, borderRadius: 8, alignItems: "center", borderWidth: 2, borderColor: theme.green300, paddingVertical: 20 }}>
                                    <Text style={{ color: theme.green600 }}>Externo</Text>
                                    <Text style={{ color: theme.green700, fontSize: 18 }}>
                                        {latestData ? latestData.s3.toFixed(1) : '--'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Antepé */}
                        <View>
                            <Text style={{ color: theme.textGray, marginBottom: 8 }}>Antepé</Text>
                            <View style={{ flexDirection: 'row', columnGap: 16 }}>
                                <View style={{ flex: 1, backgroundColor: theme.orange50, borderRadius: 8, alignItems: "center", borderWidth: 2, borderColor: theme.orange200, paddingVertical: 20 }}>
                                    <Text style={{ color: theme.orange600 }}>Interno</Text>
                                    <Text style={{ color: theme.orange700, fontSize: 18 }}>
                                        {latestData ? latestData.s6.toFixed(1) : '--'}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, backgroundColor: theme.orange100, borderRadius: 8, alignItems: "center", borderWidth: 2, borderColor: theme.orange300, paddingVertical: 20 }}>
                                    <Text style={{ color: theme.orange600 }}>Externo</Text>
                                    <Text style={{ color: theme.orange700, fontSize: 18 }}>
                                        {latestData ? latestData.s5.toFixed(1) : '--'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 16 }}>
                        <Text style={{ color: theme.textGray }}>Amostras coletadas: {sessionData.length}</Text>
                    </View>
                </CardContent>
            </Card>
        </View>
    );
}
