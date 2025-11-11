# 👟 Palmilha App (Expo/React Native)

Aplicativo móvel (Expo) para integração com a **palmilha eletrônica**: recebe dados via BLE/REST do backend, exibe gráficos/leituras e gerencia sessões de coleta.

---

## ✅ Requisitos

- **Node.js 18** (recomendado usar **nvm** para gerenciar versões)
- **Android Studio** (SDK + AVD ou dispositivo físico)
- **Java 17** (para toolchain Android/Gradle, quando necessário)
- **Expo CLI** (via `npx`)

---

## 🔽 Passo 1: Baixar o projeto

Clone ou baixe o projeto diretamente do repositório oficial:  
🔗 https://github.com/LucasSantosCarlos/palmilhaapp

Você pode fazer isso de duas formas:

- **Via Git (recomendado):**
  ```bash
  git clone https://github.com/LucasSantosCarlos/palmilhaapp.git
  cd palmilhaapp
  ```

- **Ou baixando o ZIP**: acesse o link acima e clique em **“Code” → “Download ZIP”** e extraia o projeto.

---

## 🟢 Passo 2: Instalar o Node 18

Confirme a versão:
```bash
node -v
```

Se precisar alternar versões, use o **nvm**:
```bash
nvm install 18
nvm use 18
```

---

## 📦 Passo 3: Instalar as dependências

Na pasta raiz do projeto, execute:
```bash
npm install
```

## 🤖 Passo 4: Instalar e configurar o Android Studio

Instale o **Android Studio** e configure as **variáveis de ambiente** (Windows/macOS/Linux), adicionando ao **PATH**:

- `ANDROID_HOME`
- `ANDROID_HOME/tools`
- `ANDROID_HOME/tools/bin`
- `ANDROID_HOME/platform-tools`

Documentação oficial: https://developer.android.com/tools/variables?hl=pt-br

> Em um dispositivo físico Android, ative **Depuração USB** e **Instalação via USB** (Opções de desenvolvedor).

---

## 🌐 Passo 5: Apontar o App para o backend local

Verifique seu **IP local** (ex.: `192.168.0.10`).  
Edite o arquivo:
```
src/Api.ts
```
Altere o IP configurado (conforme indicado no projeto; ex.: **linha 23**) para o seu IP local, mantendo a porta do backend (ex.: `8080`).

---

## 📲 Passo 6: Conectar um dispositivo ou abrir um emulador

- **Dispositivo físico**: conecte via USB e confirme com `adb devices` se o aparelho aparece como `device`.
- **Emulador**: abra um AVD no Android Studio (**Device Manager**) antes de rodar os comandos.

---

## ▶️ Passo 7: Rodar o aplicativo (build nativo)

Na raiz do projeto, execute **na ordem**:

```bash
npx expo prebuild
npx expo run:android
```

Isso irá:
- gerar o projeto nativo (Android) via **prebuild**;
- compilar e instalar o app no dispositivo/emulador via **run:android**.

---
