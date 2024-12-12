# {название_проекта}

{описание}

## Требования
* NodeJS >= v20.10.0
* Npm
* Docker и docker-compose

## Запуск приложения

### Для разработки
1. Установить зависимости
    ```shell
    npm install
    ```
2. Положить env файлы в директорию `env/run` (можно скопировать содержимое с `env/example`):
    * `env/run/app.env`
    * `env/run/app-database.env`
3. Запустить сервисы для приложения
    ```shell
    npm run compose:dev:up
    ```
4. Прогнать миграции
   ```shell
   npm run migrations:sync
   ```
5. Запустить само приложение
    ```shell
    npm run start
    # или
    npm run start:dev
    ```

### Для продакшена
1. Положить env файлы в директорию `env/run` (если нужно):
    * `env/run/app.env`
    * `env/run/app-database.env`
2. Запустить приложение и его сервисы
    ```shell
    npm run compose:up
    ```
3. Открыть терминал в докер-контейнере и запустить миграции
   ```shell
   docker exec -it <container_id> bash
   cd app
   npm run migrations:sync
   ```
