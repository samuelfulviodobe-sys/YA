# 📱 Notebe - Notas Produtivas

**Notebe** é um aplicativo completo de produtividade que combina anotações inteligentes com ferramentas poderosas de gestão de tempo.

## ✨ Funcionalidades

### 📝 Sistema de Notas
- Criar, editar e organizar notas rapidamente
- Busca instantânea por título ou conteúdo
- Sistema de tags para categorização
- Marcar favoritos
- Interface limpa e moderna

### 📅 Calendário Visual
- Visualize suas notas organizadas por data
- Navegação mensal intuitiva
- Painel lateral com notas do dia

### 🎯 Ferramentas de Produtividade

#### 🍅 Pomodoro Timer
- Técnica comprovada de gestão de tempo (25min foco / 5min pausa)
- Timer visual com progresso circular
- Contador de sessões diárias
- Configurações personalizáveis

#### 🎯 Kaizen - Melhoria Contínua
- Defina metas diárias de melhoria
- Acompanhe progresso semanal
- Sistema de reflexões

#### 📊 Matriz de Eisenhower
- Organize tarefas por urgência e importância
- 4 quadrantes com cores distintas
- Priorize o que realmente importa

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Express + PostgreSQL (Neon)
- **Mobile**: Ionic Capacitor (React → APK Android)

## 📦 Como Usar

### Desenvolvimento Web
```bash
npm install
npm run dev
```

Acesse:

### Gerar APK Android

**Guia Rápido**: [README-APK.md](README-APK.md)

**Publicar na Google Play**: [PUBLICAR-NA-GOOGLE-PLAY.md](PUBLICAR-NA-GOOGLE-PLAY.md)

#### Passos Resumidos:

1. **Configurar Android SDK**
```bash
echo "sdk.dir=/caminho/para/android-sdk" > android/local.properties
```

2. **Executar Script de Build**
```bash
./build-apk.sh
```

3. **APK gerado em:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 📚 Documentação

- **[README-APK.md](README-APK.md)** - Guia completo para gerar APK
- **[PUBLICAR-NA-GOOGLE-PLAY.md](PUBLICAR-NA-GOOGLE-PLAY.md)** - Passo a passo para publicação
- **[design_guidelines.md](design_guidelines.md)** - Diretrizes de design UI/UX
- **[replit.md](replit.md)** - Documentação técnica do projeto

## 🏗️ Estrutura do Projeto

```
notebe/
├── client/              # Frontend React
│   └── src/
│       ├── pages/       # Páginas (Notes, Calendar, Productivity)
│       └── components/  # Componentes UI
├── server/              # Backend Express
├── shared/              # Schemas (Drizzle ORM)
├── android/             # Projeto Android (Capacitor)
│   └── app/build/outputs/apk/  # APKs gerados
├── capacitor.config.ts  # Configuração Capacitor
├── build-apk.sh         # Script build APK debug
└── build-release.sh     # Script build APK release
```

## 🔧 Requisitos

### Para Desenvolvimento Web
- Node.js 18+
- npm ou yarn

### Para Compilar APK
- Java JDK 11+
- Android SDK (via Android Studio ou command-line tools)
- Gradle (incluído no projeto)

## 🎨 Personalizar

### Mudar Nome do App
Edite `capacitor.config.ts`:
```typescript
appName: 'Seu Nome Aqui'
```

### Mudar Package Name
Edite `capacitor.config.ts`:
```typescript
appId: 'com.seudominio.app'
```

Depois:
```bash
npx cap sync android
```

## 💾 Armazenamento

- **Desenvolvimento**: SQLite local via Drizzle ORM
- **Produção Android**: Dados salvos localmente no dispositivo
- **Privacidade**: 100% offline, sem necessidade de conta

## 📄 Licença

Este projeto foi desenvolvido como aplicativo de produtividade pessoal.

## 🆘 Suporte

Para compilar APK ou publicar na Google Play, consulte os guias:
- [README-APK.md](README-APK.md)
- [PUBLICAR-NA-GOOGLE-PLAY.md](PUBLICAR-NA-GOOGLE-PLAY.md)

---

**Desenvolvido com ❤️ usando React + Capacitor**
