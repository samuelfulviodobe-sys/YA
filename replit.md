# Notebe - Projeto Android com Capacitor

## Visão Geral
Notebe é uma aplicação React + TypeScript de produtividade e notas, configurada com **Ionic Capacitor** para gerar APK Android. O projeto combina tecnologia web moderna com empacotamento nativo Android.

## Data de Criação/Conversão
26 de outubro de 2025

## Tecnologias Utilizadas

### Frontend
- **React 18** com hooks modernos
- **TypeScript** para type safety
- **Vite** para build rápido
- **Tailwind CSS** para estilização
- **shadcn/ui** componentes UI de alta qualidade
- **Wouter** para roteamento
- **TanStack Query** para gerenciamento de estado e cache

### Backend
- **Express.js** servidor Node.js
- **PostgreSQL** (Neon) para banco de dados
- **Drizzle ORM** para queries type-safe

### Mobile (Android)
- **Ionic Capacitor** para empacotamento nativo
- **Gradle** build system Android
- **WebView** para renderização do React

## Funcionalidades Implementadas

### 1. Sistema de Notas Completo
- CRUD completo (criar, ler, atualizar, deletar)
- Busca em tempo real por título e conteúdo
- Sistema de tags para categorização
- Favoritos com estrela
- Ordenação por data de atualização
- Interface responsiva com grid adaptativo

### 2. Calendário Visual
- Visualização mensal com navegação
- Notas organizadas por data de criação
- Botão "Today" para voltar ao mês atual
- Painel lateral mostrando notas do dia selecionado
- Indicadores visuais de dias com notas

### 3. Ferramentas de Produtividade

#### 🍅 Pomodoro Timer
- Timer circular visual com progresso
- Configuração de duração de trabalho (padrão 25min)
- Configuração de duração de pausa (padrão 5min)
- Contador de sessões completadas no dia
- Notificações ao completar sessão
- Estatísticas diárias
- Persistência de sessões no banco de dados

#### 🎯 Kaizen (Melhoria Contínua)
- Criação de metas diárias de melhoria
- Sistema de checkbox para marcar como completa
- Progresso semanal visualizado
- Histórico de metas com datas
- Motivação para melhorias incrementais de 1%

#### 📊 Matriz de Eisenhower
- 4 quadrantes para priorização de tarefas:
  - Urgente e Importante (Fazer primeiro) - vermelho
  - Importante, Não Urgente (Agendar) - azul
  - Urgente, Não Importante (Delegar) - laranja
  - Não Urgente, Não Importante (Eliminar) - cinza
- Checkbox para marcar tarefas concluídas
- Visual com cores distintas para cada quadrante
- Adição rápida de tarefas em cada quadrante

## Estrutura do Projeto

```
notebe/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Componentes shadcn/ui
│   │   │   ├── app-sidebar.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── pages/
│   │   │   ├── notes.tsx     # Página de notas
│   │   │   ├── calendar.tsx  # Página de calendário
│   │   │   ├── productivity.tsx  # Pomodoro/Kaizen/Eisenhower
│   │   │   ├── note-editor.tsx
│   │   │   └── settings.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── server/                    # Backend Express
│   ├── index.ts
│   ├── routes.ts
│   └── storage.ts
├── shared/                    # Schemas compartilhados
│   └── schema.ts             # Drizzle schemas (Notes, Pomodoro, Kaizen, Eisenhower)
├── android/                   # Projeto Android (Capacitor)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/public/  # Build do React copiado aqui
│   │   │   ├── res/            # Recursos Android
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── gradle/
│   └── build.gradle
├── capacitor.config.ts        # Configuração Capacitor
├── vite.config.ts
├── tailwind.config.ts
├── package.json
├── build-apk.sh              # Script para gerar APK debug
├── build-release.sh          # Script para gerar APK release
├── README-APK.md             # Guia rápido APK
└── PUBLICAR-NA-GOOGLE-PLAY.md  # Guia completo de publicação
```

## Como Funciona

### Fluxo de Desenvolvimento → APK

1. **Desenvolvimento**: `npm run dev`
   - Vite serve o React no navegador
   - Hot reload para desenvolvimento rápido

2. **Build**: `npm run build`
   - Vite compila React para `dist/public/`
   - Assets otimizados e minificados

3. **Sync**: `npx cap sync android`
   - Capacitor copia `dist/public/` para `android/app/src/main/assets/public/`
   - Atualiza configurações nativas

4. **Compile**: `cd android && ./gradlew assembleDebug`
   - Gradle compila projeto Android
   - Gera APK em `android/app/build/outputs/apk/debug/`

### Capacitor Bridge

O Capacitor cria uma ponte entre JavaScript e APIs nativas:
```typescript
// Futuro: adicionar plugins nativos
import { Camera } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
```

## Configurações Importantes

### capacitor.config.ts
```typescript
{
  appId: 'com.notebe.app',      // ID único do app (package name)
  appName: 'Notebe',             // Nome exibido
  webDir: 'dist/public'          // Onde está o build do React
}
```

### android/app/build.gradle
- minSdkVersion: 22 (Android 5.1+)
- targetSdkVersion: 33 (Android 13)
- Java 11 compatibility

### Permissões (AndroidManifest.xml)
- INTERNET: Para conexões futuras
- Sem permissões perigosas (privacidade)

## Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção
npm run preview          # Preview do build
```

### Android (via Capacitor)
```bash
npx cap sync android     # Sincronizar web com Android
npx cap open android     # Abrir no Android Studio
```

### APK
```bash
./build-apk.sh          # Gerar APK debug (desenvolvimento)
./build-release.sh      # Gerar APK release (publicação)
```

## Banco de Dados

### Schema Drizzle

**Notes** (notas):
- id, title, content, tags[], isFavorite, createdAt, updatedAt

**PomodoroSessions** (sessões pomodoro):
- id, duration, type (work/break), completedAt

**KaizenGoals** (metas kaizen):
- id, goal, date, completed

**EisenhowerTasks** (tarefas matriz):
- id, title, quadrant, completed, noteId?, createdAt

## Decisões Arquiteturais

### Por que Capacitor (não WebView puro)?
✅ **Acesso a APIs nativas**: notificações, câmera, sensores
✅ **Manutenção**: um código para web E mobile
✅ **Plugins oficiais**: bem mantidos e documentados
✅ **Performance**: otimizado para WebView moderno
✅ **Publicação**: aceito pela Google Play

### Por que não React Native?
- Já existe codebase React web funcional
- Capacitor reutiliza 100% do código
- Menos curva de aprendizado
- Build mais rápido

### Por que não Cordova?
- Capacitor é mais moderno (fork melhorado do Cordova)
- Melhor integração com ferramentas modernas (Vite, etc)
- Plugins atualizados
- Comunidade ativa

## Publicação na Google Play

### Checklist
- [ ] Gerar keystore de release
- [ ] Configurar signing no gradle
- [ ] Compilar APK/AAB assinado
- [ ] Criar conta Google Play Developer ($25)
- [ ] Preparar assets (ícone 512x512, screenshots, banner)
- [ ] Preencher descrição e metadados
- [ ] Fazer upload
- [ ] Aguardar aprovação (1-7 dias)

**Guia completo**: `PUBLICAR-NA-GOOGLE-PLAY.md`

## Limitações do Ambiente Replit

⚠️ **A compilação completa do APK requer:**
1. Android SDK (não disponível no Replit)
2. Java JDK 11+ (pode ser limitado)
3. Gradle build tools
4. Espaço em disco para dependências

### Solução
- **Desenvolvimento**: Use o preview web no Replit
- **Compilação APK**: Baixe o projeto e compile localmente
- **Android Studio**: Importe o projeto para build completo

## Próximos Passos Sugeridos

### Funcionalidades
- [ ] Modo offline completo (Service Workers)
- [ ] Notificações push nativas (Pomodoro)
- [ ] Backup/sincronização em nuvem
- [ ] Tema escuro
- [ ] Exportar notas (PDF, TXT)
- [ ] Compartilhar notas
- [ ] Widget para home screen

### Melhorias Técnicas
- [ ] Testes automatizados (Jest, Playwright)
- [ ] CI/CD para builds automáticos
- [ ] Code splitting para bundle menor
- [ ] PWA para uso web offline

## Preferências do Usuário
- **Idioma**: Português (Brasil)
- **Método**: Capacitor (mais simples para converter React → APK)
- **Objetivo**: Publicar na Google Play Store

## Notas de Desenvolvimento
- Projeto React original mantido 100%
- Apenas adicionado Capacitor como camada nativa
- Nenhuma reescrita de código necessária
- Pronto para build local e publicação
- Workflow de desenvolvimento configurado e rodando
