import { Dimensions, Image, Text, View } from "react-native";
import { useTheme } from "../provider/ThemeProvider";
import Amostra from "../model/Amostra";
import { useEffect, useState } from "react";

interface Props {
    isActive: boolean;
    onStart: () => void;
    onStop: () => void;
    sessionData: Amostra[];
}

export default function PisadasTab({ isActive, onStop, onStart, sessionData }: Props) {
    const { theme } = useTheme();
    const [tipo, setTipo] = useState("");
    const dimensions = Dimensions.get('window');

    function calcularTipoPisada() {
        let somaLateral = 0;
        let somaMedial = 0;

        sessionData.forEach(amostra => {
            somaLateral += amostra.s1 + amostra.s3 + amostra.s5;
            somaMedial += amostra.s2 + amostra.s4 + amostra.s6;
        });
        if (somaLateral > somaMedial * 1.1) {
            setTipo("Pronada");
        }else if (somaMedial > somaLateral * 1.1) {
            setTipo("Supinada");
        } else {
            setTipo("Neutra");
        }

    }

    useEffect(() => {
        calcularTipoPisada()
    }, [sessionData.length])

    return <View>
        <Image
            source={require('./pisadas.png')}
            width={dimensions.width}
            height={400}
            style={{ width: dimensions.width, height: 400, alignSelf: 'center' }}
            resizeMode="contain"
        />

        <View style={{ flexDirection: "row", marginTop: 16 }}>
            <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 16 }}>
                Seu tipo de pisada é:
            </Text>
            <Text style={{ color: theme.primary, fontSize: 16, marginLeft: 8 }}>{tipo}</Text>
        </View>
    </View>
}