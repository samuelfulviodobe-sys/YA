#!/bin/bash

echo "================================================"
echo "   Notebe - Script de APK RELEASE (Assinado)"
echo "   Para publicação na Google Play"
echo "================================================"
echo ""

# Verificar se keystore existe
if [ ! -f "android/notebe-release.keystore" ]; then
    echo "⚠️  ATENÇÃO: Keystore não encontrada!"
    echo ""
    echo "Para gerar APK de release, você precisa criar uma keystore primeiro:"
    echo ""
    echo "cd android"
    echo "keytool -genkey -v -keystore notebe-release.keystore \\"
    echo "  -alias notebe-key \\"
    echo "  -keyalg RSA \\"
    echo "  -keysize 2048 \\"
    echo "  -validity 10000"
    echo ""
    echo "Depois, configure o arquivo android/gradle.properties"
    echo "Veja o guia: PUBLICAR-NA-GOOGLE-PLAY.md"
    echo ""
    exit 1
fi

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
echo "🔨 Passo 3: Compilar APK RELEASE (assinado)..."
cd android && ./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "   ✅ APK RELEASE compilado com sucesso!"
    echo "================================================"
    echo ""
    echo "📱 Localização do APK:"
    echo "   android/app/build/outputs/apk/release/app-release.apk"
    echo ""
    echo "📦 Este APK está:"
    echo "   ✓ Assinado com sua keystore"
    echo "   ✓ Otimizado (minificado)"
    echo "   ✓ Pronto para publicar na Google Play"
    echo ""
    echo "🚀 Próximo passo:"
    echo "   Faça upload deste APK na Google Play Console"
    echo "   Veja o guia: PUBLICAR-NA-GOOGLE-PLAY.md"
    echo ""
    
    # Mostrar informações do APK
    echo "📊 Informações do APK:"
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
        SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo "   Tamanho: $SIZE"
    fi
    echo ""
else
    echo ""
    echo "❌ Erro ao compilar APK"
    echo ""
    echo "💡 Verifique se:"
    echo "   1. A keystore existe em android/notebe-release.keystore"
    echo "   2. O arquivo android/gradle.properties está configurado"
    echo "   3. As senhas da keystore estão corretas"
    echo ""
    echo "Veja o guia completo: PUBLICAR-NA-GOOGLE-PLAY.md"
    echo ""
    exit 1
fi
