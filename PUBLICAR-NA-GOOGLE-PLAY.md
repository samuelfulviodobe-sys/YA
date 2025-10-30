# 📱 Como Publicar o Notebe na Google Play Store

## Guia Completo e Simples

Este guia vai te ensinar passo a passo como publicar seu app Notebe na Google Play Store.

---

## 📋 Pré-requisitos

### 1. Conta de Desenvolvedor Google Play
- Acesse: https://play.google.com/console
- Taxa única de inscrição: $25 USD
- Preencha as informações da sua conta

### 2. Ferramentas no Computador
- **Java JDK 11+**: `sudo apt install openjdk-11-jdk`
- **Android SDK**: via Android Studio ou ferramentas de linha de comando
- **Node.js**: Já instalado no projeto

### 3. Configurar Android SDK
```bash
# Criar arquivo local.properties na pasta android/
echo "sdk.dir=/caminho/para/android-sdk" > android/local.properties
```

**Caminhos comuns:**
- Linux: `/home/seu-usuario/Android/Sdk`
- Mac: `/Users/seu-usuario/Library/Android/sdk`
- Windows: `C:\Users\SeuUsuario\AppData\Local\Android\Sdk`

---

## 🔨 Passo 1: Gerar Keystore (Chave de Assinatura)

A keystore é como uma "assinatura digital" do seu app. **GUARDE ELA COM SEGURANÇA!**

```bash
# Entrar na pasta android
cd android

# Gerar keystore (faça UMA VEZ apenas)
keytool -genkey -v -keystore notebe-release.keystore \
  -alias notebe-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Durante o processo:**
- Digite uma senha forte (ANOTE EM LUGAR SEGURO!)
- Preencha seus dados (nome, organização, cidade, etc.)
- Confirme com "yes" no final

**⚠️ IMPORTANTE:**
- Guarde o arquivo `notebe-release.keystore` em local seguro
- Anote a senha em lugar seguro (cofre de senhas)
- **SE PERDER A KEYSTORE, NÃO PODERÁ ATUALIZAR O APP NUNCA MAIS!**

---

## ⚙️ Passo 2: Configurar Gradle para Release

### 2.1 Criar arquivo de configuração

```bash
# Na pasta android/, criar arquivo gradle.properties (se não existir)
nano android/gradle.properties
```

Adicione no final:
```properties
NOTEBE_RELEASE_STORE_FILE=notebe-release.keystore
NOTEBE_RELEASE_KEY_ALIAS=notebe-key
NOTEBE_RELEASE_STORE_PASSWORD=SUA_SENHA_AQUI
NOTEBE_RELEASE_KEY_PASSWORD=SUA_SENHA_AQUI
```

**⚠️ NUNCA COMMITE ESTE ARQUIVO NO GIT!** (Já está no .gitignore)

### 2.2 Editar build.gradle do app

```bash
nano android/app/build.gradle
```

Adicione dentro de `android { ... }`:

```gradle
signingConfigs {
    release {
        storeFile file(NOTEBE_RELEASE_STORE_FILE)
        storePassword NOTEBE_RELEASE_STORE_PASSWORD
        keyAlias NOTEBE_RELEASE_KEY_ALIAS
        keyPassword NOTEBE_RELEASE_KEY_PASSWORD
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

---

## 📦 Passo 3: Compilar APK de Release

```bash
# Voltar para raiz do projeto
cd ..

# Build do React
npm run build

# Sincronizar com Capacitor
npx cap sync android

# Compilar APK assinado
cd android && ./gradlew assembleRelease
```

**APK estará em:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎨 Passo 4: Preparar Assets para Google Play

### 4.1 Ícone do App
- Tamanho: 512x512 pixels
- Formato: PNG (32-bit)
- Sem transparência

### 4.2 Banner (Feature Graphic)
- Tamanho: 1024x500 pixels
- Formato: PNG ou JPEG

### 4.3 Screenshots (mínimo 2, máximo 8)
- **Telefone**: 16:9 ou 9:16
- Largura mínima: 320px
- Largura máxima: 3840px
- Formato: PNG ou JPEG

**Dica:** Use um emulador Android ou dispositivo real para capturar as telas do app.

### 4.4 Descrição do App

**Título (máximo 30 caracteres):**
```
Notebe - Notas Produtivas
```

**Descrição Curta (máximo 80 caracteres):**
```
Organize suas notas, tarefas e aumente sua produtividade diariamente
```

**Descrição Completa (máximo 4000 caracteres):**
```
📝 Notebe - Seu Bloco de Notas Produtivo

Organize sua vida de forma simples e produtiva com o Notebe! Um aplicativo completo que combina anotações inteligentes com ferramentas poderosas de produtividade.

✨ FUNCIONALIDADES PRINCIPAIS

📋 NOTAS INTELIGENTES
• Crie e organize notas rapidamente
• Busca instantânea por título ou conteúdo
• Sistema de tags para categorização
• Marque notas favoritas
• Interface limpa e intuitiva

📅 CALENDÁRIO VISUAL
• Visualize suas notas por data
• Navegação mensal fácil
• Veja rapidamente o que você escreveu em cada dia

🎯 FERRAMENTAS DE PRODUTIVIDADE

🍅 POMODORO TIMER
• Técnica comprovada de gestão de tempo
• Sessões de foco configuráveis (padrão 25min)
• Pausas automáticas (padrão 5min)
• Contador de sessões completadas
• Notificações ao finalizar

🎯 KAIZEN - Melhoria Contínua
• Defina metas diárias de melhoria
• Acompanhe seu progresso semanal
• Cultive hábitos de crescimento constante
• Reflexões diárias

📊 MATRIZ DE EISENHOWER
• Organize tarefas por urgência e importância
• 4 quadrantes: Fazer, Agendar, Delegar, Eliminar
• Priorize o que realmente importa
• Visualização clara com cores

💾 PRIVACIDADE E SEGURANÇA
• Todos os dados salvos localmente no dispositivo
• Sem necessidade de criar conta
• Funciona 100% offline
• Seus dados são SEUS

🎨 DESIGN MODERNO
• Interface bonita e intuitiva
• Tema moderno com cores agradáveis
• Totalmente responsivo
• Experiência fluida

PERFEITO PARA:
✓ Estudantes que querem organizar estudos
✓ Profissionais que gerenciam múltiplas tarefas
✓ Empreendedores focados em produtividade
✓ Qualquer pessoa que quer ser mais organizada

📲 Baixe agora e transforme sua produtividade!

SUPORTE: notebe.app@gmail.com
```

---

## 📤 Passo 5: Upload para Google Play Console

### 5.1 Criar Novo App
1. Acesse https://play.google.com/console
2. Clique em "Criar app"
3. Preencha:
   - Nome: Notebe
   - Idioma padrão: Português (Brasil)
   - Tipo: App
   - Gratuito ou Pago: Gratuito
4. Aceite as políticas

### 5.2 Configurar Página da Loja
1. **Detalhes do app**
   - Título: Notebe
   - Descrição curta e completa (use as acima)
   - Categoria: Produtividade
   
2. **Assets gráficos**
   - Ícone: 512x512px
   - Banner: 1024x500px
   - Screenshots: Mínimo 2 capturas de tela

3. **Classificação de conteúdo**
   - Preencha o questionário
   - Selecione "Não contém anúncios"
   
4. **Público-alvo**
   - Faixa etária: Todos
   - Sem conteúdo infantil

### 5.3 Upload do APK/AAB
1. Vá em "Produção" → "Criar nova versão"
2. Faça upload do APK:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```
3. **OU gere AAB** (recomendado pela Google):
   ```bash
   cd android && ./gradlew bundleRelease
   ```
   Upload: `android/app/build/outputs/bundle/release/app-release.aab`

4. Preencha as notas de versão:
   ```
   Versão 1.0.0 - Lançamento Inicial
   
   ✨ Novidades:
   • Sistema completo de notas
   • Calendário visual
   • Pomodoro Timer
   • Kaizen - Melhoria contínua
   • Matriz de Eisenhower
   • Interface moderna e intuitiva
   ```

### 5.4 Revisar e Publicar
1. Revise todas as informações
2. Clique em "Revisar versão"
3. Clique em "Começar lançamento para produção"
4. Aguarde aprovação (1-7 dias)

---

## ✅ Checklist Final

Antes de publicar, verifique:

- [ ] Testei o app em diferentes dispositivos
- [ ] Todas as funcionalidades funcionam offline
- [ ] Não há erros ou crashes
- [ ] Keystore está guardada em local seguro
- [ ] Senha da keystore está anotada
- [ ] Ícones e screenshots estão prontos (boa qualidade)
- [ ] Descrições estão completas e sem erros
- [ ] Informações de contato estão corretas
- [ ] Política de privacidade criada (se necessário)

---

## 🔄 Como Atualizar o App (Próximas Versões)

```bash
# 1. Fazer mudanças no código

# 2. Atualizar versão no android/app/build.gradle
# Incremente versionCode e versionName

# 3. Build
npm run build
npx cap sync android

# 4. Compilar release
cd android && ./gradlew assembleRelease

# 5. Upload na Google Play Console
# Criar nova versão e fazer upload do novo APK/AAB
```

---

## 📞 Suporte

Se tiver dúvidas:
- Documentação Google Play: https://support.google.com/googleplay/android-developer
- Documentação Capacitor: https://capacitorjs.com/docs

---

**🎉 Parabéns! Você está pronto para publicar seu app na Google Play!**
