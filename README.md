
## TEST APP TIENDA MIA

-- Desarrollado por: Sandro Nolasco

### Tecnologias usadas

- NestJS
- NodeJS
- Typescript
- Prisma ORM
- Swagger (Documentación)
- Vitest
- RabbitMQ
- PostgreSQL
- Docker
- AWS S3

## Instalación

``` 
docker compose up --build -d 
```

Este comando levantara los contenedores de RabbitMQ y PostgreSQL justo a sus respectivos 2 microservicios, el de skus y el de ordenes. 

## Endpoints

## Skus

#### RUTA BASE: http://localhost:4000/api/skus

- GET /:sku
  
Retorna un sku en especifico por nombre de sku

- GET /getAllSkuOffers/:sku

Retorna todas las ofertas de un sku en especifico

- GET /getBestSkuOffer/:sku
  
Retorna la mejor oferta de un sku en especifico

- GET getBestSkuOffers/:sku?limit=1&page=1

Retorna las mejores ofertas de un sku en especifico, se puede especificar el limite de ofertas a retornar y la pagina

#### RUTA BASE: http://localhost:4000/api/sales

- POST /sales 

Crea una venta de una oferta de un sku en especifico, se debe enviar el sku, la oferta y la cantidad de productos a comprar. Se envia un mensaje a la cola de RabbitMQ para que el microservicio de ordenes procese la venta y guarde la orden en la base de datos.

## Orders

#### RUTA BASE: http://localhost:4001/api/orders

- GET /report
  
Genera un reporte de las ventas realizadas en el dia, el reporte se guarda en un archivo csv en el bucket de S3 de AWS como backup y se envia via email a la direccion especificada en el archivo .env

- GET /report/:date

Genera un reporte de las ventas realizadas en el dia especificado, el reporte se guarda en un archivo csv en el bucket de S3 de AWS como backup y se envia via email a la direccion especificada en el archivo .env




```json
Ejemplo de param :date para el endpoint /report/:date

{
    "date": "2023-07-14"
}

enviado como parametro en la url quedaria asi: "http://localhost:4001/api/orders/report/2023-07-14"
```

- GET /report/:date/file

Este endpoint retorna el archivo csv del reporte de ventas del dia especificado, el archivo se encuentra en el bucket de S3 de AWS

```json
Ejemplo de param :date para el endpoint /report/:date/file

{
    "date": "2023-07-14"
}

enviado como parametro en la url quedaria asi: "http://localhost:4001/api/orders/report/2023-07-14/file"

retorno del endpoint:

{
    "url": "https://tiendamia-test.s3.amazonaws.com/daily-reports/2023-07-14.csv"
}
```

## Variables de entorno

### Orders microservice

```json
DATABASE_URL="postgresql://postgres:postgres@postgres_db:5432/sales?schema=public"
NODE_ENV="development"
PORT=4001
RABBITMQ_URL="amqp://root:root@rabbitmq:5672"
RABBITMQ_QUEUE="sales_queue"
EMAIL_USER="" ## Se debe configurar un email para poder enviar los reportes de ventas
EMAIL_PASSWORD="" ## Se debe configurar un email para poder enviar los reportes de ventas
EMAIL_HOST="sandbox.smtp.mailtrap.io"
EMAIL_PORT=2525
S3_BUCKET="tienda-mia-sales-reports"
AWS_REGION="us-east-1"
AWS_ID_ACCESS_KEY="" ## Se debe configurar un usuario de AWS con permisos de S3 para poder guardar los reportes de ventas
AWS_SECRET_ACCESS_KEY="" ## Se debe configurar un usuario de AWS con permisos de S3 para poder guardar los reportes de ventas
STORAGE_TYPE="s3" ## Se debe configurar el tipo de storage, puede ser local o s3, si es local se guardaran los reportes en la carpeta storage del proyecto, algunas funciones no estaran disponibles si se usa local
EMAIL_SENDER="tiendamia@test.com"
EMAIL_ADMIN_RECEIVER="tiendamia-admin@test.com"
LOCAL_STORAGE_PATH="./storage"
LOCAL_STORAGE_HOST="http://localhost:4001"
```

### skus microservice

```json
DATABASE_URL="postgresql://postgres:postgres@postgres_db:5432/sales?schema=public"
NODE_ENV="development"
PORT=4000
RABBITMQ_URL="amqp://root:root@rabbitmq:5672"
RABBITMQ_QUEUE="sales_queue"
```

## Documentación

- Swagger: http://localhost:4000/docs
- Swagger: http://localhost:4001/docs 


## Notas

- Se debe configurar un usuario de AWS con permisos de S3 para poder guardar los reportes de ventas, recomiendo crear un usuario con permisos de solo S3 y solo lectura y edicion para el bucket de S3 que se va a usar para guardar los reportes de ventas. Dar acceso publico de lectura al bucket de S3 para que se puedan descargar los reportes de ventas. Cuando se envia el email con el reporte de ventas se envia el archivo csv como adjunto, pero si se quiere descargar el archivo desde el bucket de S3 se puede usar el endpoint /report/:date/file
  
- Se debe configurar un email para poder enviar los reportes de ventas, recomiendo usar mailtrap para pruebas.

- Se debe configurar el tipo de storage, puede ser local o s3, si es local se guardaran los reportes en la carpeta storage del proyecto, algunas funciones no estaran disponibles si se usa local.

- Si se quiere realizar pruebas en local se debe usar el comando pnpm i en cada microservicio para instalar las dependencias, luego se debe configurar el archivo .env con las variables de entorno, luego se debe ejecutar el comando pnpm run start:dev en cada microservicio para levantar los microservicios en local. Se debe tener instalado RabbitMQ y PostgreSQL en local para poder realizar pruebas en local.

- Recuerda correr el comando pnpm prisma:generate y pnpm prisma:migrate:dev en el microservicio de orders para que no falle la conexion a la database.  

## TODO

- Agregar pruebas e2e
- Agregar pruebas unitarias para orders microservice








