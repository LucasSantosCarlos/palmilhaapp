import { Text, View } from "react-native";
import Amostra from "../model/Amostra";
import {
    Canvas,
    Circle,
    Image,
    useImage,
    Blur,
    rect,
    Rect,
    LinearGradient,
    vec
} from "@shopify/react-native-skia";
import { useTheme } from "../provider/ThemeProvider";

interface Props {
    isActive: boolean;
    onStart: () => void;
    onStop: () => void;
    sessionData: Amostra[];
}

function interpolarCor(valor: number): string {
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const v = clamp(valor);

    // Dividimos a escala em 3 segmentos:
    // [0–0.33]: azul → verde
    // [0.33–0.66]: verde → amarelo
    // [0.66–1]: amarelo → vermelho

    let r = 0, g = 0, b = 0;

    if (v < 0.33) {
        // azul (0,0,255) → verde (0,255,0)
        const t = v / 0.33;
        r = 0;
        g = 255 * t;
        b = 255 * (1 - t);
    } else if (v < 0.66) {
        // verde (0,255,0) → amarelo (255,255,0)
        const t = (v - 0.33) / 0.33;
        r = 255 * t;
        g = 255;
        b = 0;
    } else {
        // amarelo (255,255,0) → vermelho (255,0,0)
        const t = (v - 0.66) / 0.34;
        r = 255;
        g = 255 * (1 - t);
        b = 0;
    }

    // Usa transparência proporcional à intensidade
    return `rgba(${r}, ${g}, ${b}, ${0.6 + v * 0.4})`;
}

export default function MapaCalorTab(props: Props) {
    const imagemPe = useImage(require("./palmilha.png"));
    const { theme } = useTheme();

    // Exemplo de sensores
    

    const largura = 350;
    const altura = 600;
    const amostraAtual = props.sessionData[props.sessionData.length - 1];

    const sensores = [
        { x: 140, y: 80, intensidade: amostraAtual ? (amostraAtual.s5)/100 : 0 },
        { x: 250, y: 80, intensidade: amostraAtual ? (amostraAtual.s6)/100 : 0 },
        { x: 130, y: 300, intensidade: amostraAtual ? (amostraAtual.s3)/100 : 0 },
        { x: 250, y: 300, intensidade: amostraAtual ? (amostraAtual.s4)/100 : 0 },
        { x: 100, y: 500, intensidade: amostraAtual ? (amostraAtual.s1)/100 : 0 },
        { x: 200, y: 500, intensidade: amostraAtual ? (amostraAtual.s2)/100 : 0 },
    ];
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }}>
            <Canvas style={{ width: largura, height: altura }}>
                {/* Imagem de fundo */}
                {imagemPe && (
                    <Image
                        image={imagemPe}
                        x={0}
                        y={0}
                        width={largura}
                        height={altura}
                        fit="contain"
                    />
                )}

                {/* Pontos de calor */}
                {sensores.map((p, i) => (
                    <Circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={20} // raio maior conforme intensidade
                        color={interpolarCor(p.intensidade)}
                    />
                ))}

                {/* Suavização do calor */}
                <Blur blur={60} mode="decal" />
            </Canvas>

            <View
                style={{
                    marginRight: 20,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {/* Percentuais à esquerda */}
                <View
                    style={{
                        height: altura * 0.6,
                        justifyContent: "space-between",
                        marginRight: 8,
                    }}
                >
                    <Text>100%</Text>
                    <Text>75%</Text>
                    <Text>50%</Text>
                    <Text>25%</Text>
                    <Text>0%</Text>
                </View>

                {/* Gradiente vertical */}
                <Canvas style={{ width: 50, height: altura * 0.6 }}>
                    <Rect x={0} y={0} width={25} height={altura * 0.6}>
                        <LinearGradient
                            start={vec(0, 0)}
                            end={vec(0, altura * 0.6)}
                            colors={[
                                interpolarCor(1),
                                interpolarCor(0.75),
                                interpolarCor(0.5),
                                interpolarCor(0.25),
                                interpolarCor(0),
                            ]}
                        />
                    </Rect>
                </Canvas>
            </View>
        </View>
    );
}