import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Sessao from "../../src/model/Sessao";
import { converterDataHora } from "../../src/util/convert";
import { useTheme } from "../../src/provider/ThemeProvider";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import SessaoService from "../../src/service/SessaoService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";

const service = new SessaoService()
export default function ListaSessaoPage() {
    const [sessoes, setSessoes] = useState<Sessao[]>([])
    const { theme } = useTheme();
    const router = useRouter();

    const isFocused = useIsFocused();

    useEffect(() => {
        service.buscarTodas().then((sessoesBuscadas) => {
            console.log("Sessões buscadas:", sessoesBuscadas);
            setSessoes(sessoesBuscadas)
        }).catch((error) => {
            console.error("Erro ao buscar sessões:", error);
        })
    }, [isFocused])

    return <SafeAreaView style={{ flex: 1, padding: 8, paddingTop: 16, backgroundColor: theme.background }}>
        <Text style={{ fontSize: 22, fontWeight: 700, color: theme.text, textAlign: "center", marginBottom: 12 }}>Sessões</Text>
        <TouchableOpacity style={[styles.floatingButton, { backgroundColor: theme.primary }]} onPress={() => router.push({ pathname: "/pages/SessaoPage" })}>
            <Plus size={24} color="white" />
        </TouchableOpacity>
        <FlatList
            data={sessoes}
            keyExtractor={(item) => item.id?.toString() || ""}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={{ rowGap: 8, padding: 16, backgroundColor: theme.boxBackground, boxShadow: theme.boxShadow, borderRadius: 8, marginBottom: 16 }}
                    onPress={() => {
                        router.push({ pathname: "/pages/SessaoPage", params: { id: item.id } })
                    }} >
                    <Text style={{ color: theme.text }}><Text style={{ fontWeight: 700 }}>Iniciado em: </Text>{converterDataHora(item.iniciadoEm)}</Text>
                    <Text style={{ color: theme.text }}><Text style={{ fontWeight: 700 }}>Finalizado em: </Text>{converterDataHora(item.finalizadoEm)}</Text>
                    <Text style={{ color: theme.text }}><Text style={{ fontWeight: 700 }}>Amostras: </Text> {item.amostras.length} </Text>
                </TouchableOpacity>
            )}
        />
    </SafeAreaView >
}

const styles = StyleSheet.create({
    floatingButton: {
        zIndex: 100,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 40,
        right: 30,
        elevation: 5, // For Android shadow
        shadowColor: "#000", // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
})