#!/bin/bash

echo "================================================"
echo "   Notebe - Script de Compilação de APK"
echo "   (usando Capacitor + Android)"
echo "================================================"
echo ""

echo "📦 Passo 1: Fazer build do React..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao fazer build do React"
    exit 1
fi

echo ""
echo "🔄 Passo 2: Sincronizar com Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Erro ao sincronizar com Capacitor"
    exit 1
fi

echo ""
echo "🔨 Passo 3: Compilar APK Android..."
cd android && ./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "   ✅ APK compilado com sucesso!"
    echo "================================================"
    echo ""
    echo "📱 Localização do APK:"
    echo "   android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "📦 Instalar no dispositivo conectado:"
    echo "   adb install android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "🎉 Pronto para usar ou publicar!"
    echo ""
else
    echo ""
    echo "❌ Erro ao compilar APK"
    echo ""
    echo "💡 Dicas de solução:"
    echo "   1. Verifique se o Android SDK está instalado"
    echo "   2. Configure o arquivo local.properties na pasta android/"
    echo "   3. Execute: yes | sdkmanager --licenses"
    echo "   4. Verifique a versão do Java (necessário JDK 11+)"
    echo ""
    exit 1
fi
