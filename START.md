# {название_проекта}

{описание}

## Требования
* NodeJS >= v20.10.0
* Npm

## Запуск приложения

### Для разработки
1. Установить зависимости
    ```shell
    npm install
    ```
2. Положить env файлы в директорию `env/run` (можно скопировать содержимое с `env/example`):
    * `env/run/app.env`
3. Прогнать миграции
   ```shell
   npm run migrations:sync
   ```
4. Запустить само приложение
    ```shell
    npm run start
    # или
    npm run start:dev
    ```
