# Chat Application with AI Integration

Чат-приложение с поддержкой AI-ассистента, построенное на React, Material-UI и TanStack Query.

## Основные функции

### Чаты
- Поддержка двух типов чатов:
  - AI чаты (с использованием ChatGPT API)
  - Обычные чаты (с другими пользователями)
- Создание новых чатов обоих типов
- Поиск по существующим чатам
- Индикаторы статуса сообщений (отправлено, доставлено, прочитано)

### AI Интеграция
- Интеграция с OpenAI ChatGPT API
- Индикация набора текста AI-ассистентом
- Обработка ошибок API
- Управление состоянием запросов через TanStack Query

### UI/UX
- Material-UI компоненты
- Темная/светлая тема
- Адаптивный дизайн (мобильная/десктопная версия)
- Боковая панель с списком чатов
- Индикаторы непрочитанных сообщений

## Техническая реализация

### Основные технологии
- React
- TypeScript
- Material-UI
- TanStack Query
- OpenAI API

### Структура проекта
```
src/
  ├── components/
  │   ├── ChatArea.tsx    # Область чата
  │   ├── Sidebar.tsx     # Боковая панель
  │   └── NewChatDialog.tsx # Диалог создания чата
  ├── types/
  │   └── chat.ts         # Типы для чатов и сообщений
  └── App.tsx             # Основной компонент
```

### Управление состоянием
- TanStack Query для управления API запросами
- React useState для локального состояния
- Контекст темы из Material-UI

### API Интеграция
```typescript
const aiChatMutation = useMutation({
  mutationFn: async (text: string) => {
    const completion = await ai.chat.completions.create({
      messages: [
        { role: "system", content: "Вы - дружелюбный и полезный ассистент." },
        { role: "user", content: text }
      ],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0]?.message?.content;
  },
  onError: (error: Error) => {
    console.error('OpenAI API error:', error);
  }
});
```

### Типы данных
```typescript
interface Chat {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime: string;
  unreadCount: number;
  isAI: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  status: 'sent' | 'delivered' | 'read' | 'error';
  type: 'text' | 'error';
}
```

## Установка и запуск

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корне проекта:
```
VITE_OPENAI_API_KEY=your_api_key_here
```

4. Запустите проект:
```bash
npm run dev
```

## Особенности реализации

### Обработка сообщений
- Автоматическая прокрутка к новым сообщениям
- Индикация статуса сообщений
- Поддержка мультистрочных сообщений
- Обработка ошибок API

### Оптимизация
- Использование TanStack Query для кэширования и управления состоянием запросов
- Ленивая загрузка компонентов
- Оптимизированная обработка списка сообщений

### UI особенности
- Адаптивный сайдбар (сворачивается на мобильных устройствах)
- Индикаторы состояния (печатает, онлайн)
- Поддержка темной/светлой темы
- Анимации и переходы

## Интеграция TanStack Query

### Зачем добавлен TanStack Query
TanStack Query добавлен для улучшения работы с ChatGPT API. Основные преимущества:
- Автоматическое управление состоянием загрузки (`isLoading`)
- Встроенная обработка ошибок (`isError`)
- Индикация успешного выполнения (`isSuccess`)
- Возможность повторных попыток при ошибках
- Кэширование ответов (если необходимо)

### Пример использования
```typescript
// Создание мутации для работы с ChatGPT API
const aiChatMutation = useMutation({
  mutationFn: async (text: string) => {
    const completion = await ai.chat.completions.create({
      messages: [
        { role: "system", content: "Вы - дружелюбный и полезный ассистент." },
        { role: "user", content: text }
      ],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0]?.message?.content;
  },
  onError: (error: Error) => {
    console.error('OpenAI API error:', error);
  }
});

// Использование в компоненте
const handleSendMessage = async (text: string) => {
  if (selectedChat?.isAI) {
    setIsTyping(true);
    try {
      // Использование мутации для отправки запроса
      const aiResponseText = await aiChatMutation.mutateAsync(text);
      // Обработка ответа...
    } finally {
      setIsTyping(false);
    }
  }
};
```

### Преимущества использования TanStack Query
1. **Улучшенная обработка состояний:**
   ```typescript
   // Доступ к состояниям загрузки
   aiChatMutation.isLoading  // идет запрос
   aiChatMutation.isError    // произошла ошибка
   aiChatMutation.isSuccess  // успешное выполнение
   ```

2. **Автоматическая обработка ошибок:**
   ```typescript
   onError: (error: Error) => {
     console.error('OpenAI API error:', error);
     // Возможность глобальной обработки ошибок
   }
   ```

3. **Оптимизация производительности:**
   - Автоматическое управление состоянием загрузки
   - Встроенная система повторных попыток
   - Возможность кэширования ответов

4. **Чистый код:**
   - Меньше бойлерплейта
   - Централизованная обработка запросов
   - Легкое тестирование
