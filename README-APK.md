# 📱 Notebe - Gerar APK Android

## 🚀 Método Simples com Capacitor

Este projeto React foi configurado com **Ionic Capacitor** para gerar APK Android facilmente.

---

## ⚡ Compilar APK (3 Passos)

### 1️⃣ Configurar Android SDK

Crie o arquivo `android/local.properties`:

```bash
echo "sdk.dir=/caminho/para/android-sdk" > android/local.properties
```

**Caminhos comuns:**
- Linux: `/home/seu-usuario/Android/Sdk`
- Mac: `/Users/seu-usuario/Library/Android/sdk`

### 2️⃣ Executar Script de Build

```bash
./build-apk.sh
```

Este script faz automaticamente:
- ✅ Build do React (npm run build)
- ✅ Sincroniza com Capacitor (npx cap sync)
- ✅ Compila APK Android (gradlew assembleDebug)

### 3️⃣ Instalar no Celular

**APK gerado em:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Instalar via USB:**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Ou:** Copie o APK para o celular e instale diretamente!

---

## 📦 Publicar na Google Play

Para publicar na loja oficial, siga o guia completo:

📖 **[PUBLICAR-NA-GOOGLE-PLAY.md](PUBLICAR-NA-GOOGLE-PLAY.md)**

Este guia ensina passo a passo:
- Como criar keystore (assinatura do app)
- Como gerar APK de Release assinado
- Como fazer upload na Google Play Console
- Como atualizar o app no futuro

---

## 🛠️ Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Rodar app no navegador
npm run build        # Build de produção
```

### Capacitor
```bash
npx cap sync         # Sincronizar web assets com Android
npx cap open android # Abrir no Android Studio
```

### Android
```bash
cd android && ./gradlew assembleDebug   # APK de debug
cd android && ./gradlew assembleRelease # APK de release (precisa keystore)
cd android && ./gradlew bundleRelease   # AAB para Google Play
```

---

## 📋 Requisitos

- **Node.js 18+**: Já instalado
- **Java JDK 11+**: `sudo apt install openjdk-11-jdk`
- **Android SDK**: Via Android Studio ou command-line tools

---

## 🎨 Personalizar App

### Mudar Nome do App
Edite: `capacitor.config.ts`
```typescript
appName: 'Seu Nome Aqui'
```

### Mudar ID do App (Package Name)
Edite: `capacitor.config.ts`
```typescript
appId: 'com.seudominio.seuapp'
```

Depois execute:
```bash
npx cap sync android
```

### Mudar Ícone
Substitua os arquivos em:
```
android/app/src/main/res/mipmap-*/ic_launcher.png
```

---

## ✅ Estrutura do Projeto

```
notebe/
├── client/              # Código React
│   └── src/
│       ├── pages/       # Páginas (Notes, Calendar, Productivity)
│       └── components/  # Componentes UI
├── server/              # Backend Express
├── android/             # Projeto Android (Capacitor)
│   └── app/
│       └── build/
│           └── outputs/
│               └── apk/ # APKs gerados aqui
├── capacitor.config.ts  # Configuração Capacitor
├── build-apk.sh         # Script de build
└── package.json         # Dependências
```

---

## 🐛 Problemas Comuns

### "SDK location not found"
**Solução:** Criar `android/local.properties` com caminho do SDK

### "Java version incompatível"
**Solução:** Instalar Java 11+
```bash
sudo apt install openjdk-11-jdk
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

### Build falha
**Solução:**
```bash
npm run build
npx cap sync android
cd android && ./gradlew clean
cd android && ./gradlew assembleDebug
```

---

## 📞 Ajuda

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Developer**: https://developer.android.com

---

**🎉 Seu app está pronto para virar APK Android!**
