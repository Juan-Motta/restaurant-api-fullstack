# Alegra Restaurant App

Este documento presenta un resumen de las decisiones que se tomaron para realizar el
proyecto
### Consideraciones a tener en cuenta
De acuerdo a las limitaciones impuestas de utilizar node puro se debe tener en cuenta
* No se hizo uso de frameworks/librerias como express o NestJS para el backend
* No se hizo uso de ORMs como Prisma, Squalize etc.
* Las implementaciones se realizaron al menor nivel posible y solo se utilizaron
paquetes necesarios como: libreria manejo de conexion a DB, manejo de JWT y
manejo de conexion a rabbitMQ
Sin enbargo debido a la arquitectura hexagonal del proyecto es posible implementar
cualquiera de estas funcionalidades de manera sencilla como se explica mas adelante

### Usuario de pruebas frontend
* email: jhon@example.com
* password: abcd1234
* url: https://restaurantapp.juanandresdeveloper.com/login

## Arquitectura del proyecto

El proyecto se compone de siete servicios, todos implementados con Docker y orquestados mediante Docker Compose. Los servicios son:

* Frontend
* Balanceador de Carga
* API Backend
* Microservicio de Almacenamiento
* Microservicio de Cocina
* Broker de Mensajería
* Base de Datos

La arquitectura es de microservicios basada en eventos. La API principal funciona como backend for frontend la cual se encarga de gestionar todas las solicitudes del frontend. Esta API genera eventos que se envían al broker de mensajería, el cual utiliza un sistema de publicación/suscripción (pub/sub) para notificar a los microservicios pertinentes.

Además, el backend for frontend incorpora un balanceador de carga, lo que permite escalar este servicio según sea necesario, asegurando alta disponibilidad y un alto nivel de procesamiento en momentos de alta demanda.

Los proyectos de backend estan basados en una arquitectura hexagonal la cual permite que el proyecto sea mas escalable a largo plazo permitiendo asi encapsular logica en 3 capas

* infraestructura
* aplicacion
* dominio

En donde toda la logica de negocio esta contenida en la capa de aplicacion y dominio y las configuraciones externas en la capa de infrestructura, esto permite poder realizar cambios o migraciones de tecnologias reduciendo el esfuerzo y la complejidas del cambio.

Por ejemplo si se deseara cambiar la implementacion de la api rest a express, solo es necesario ajustar el archivo de implementacion principal y el adaptador de entrada de la api, lo mismop con la base de datos la cual solo implica el cambio de la conexion y los repositorios.

## Despliegue
El proyecto utiliza las siguientes tecnologias
* NodeJS
* Postgres
* VueJS
* RabbitMQ
* Nginx

Presenta la siguiente configuracion
```
.
└── project/
    ├── backend/
    │   ├── api
    │   ├── storages
    │   └── kitchen
    └── frontend/
        └── restaurant
```
En la raiz del project existe un archivo **docker-compose.yml** el cual permite levantar todo el proyecto mediante el comando
```bash
docker-compose up --build
```

#### En docker no es necesario configurar variables de entorno
Las variables de entorno estan configuradas para que el proyecto funcione sin realizar configuraciones extras, estas variables son **.env.docker**

## Servicios adicionales

### Conexión con base de datos

Para realizar la conexión con la base de datos se dispone del servicio Adminer el cual se puede acceder desde `http://localhost:4001` mediante las siguientes credenciales por defecto

* **server**: postgres
* **user**: postgres
* **password**: postgres
* **database**: restaurant_db


### Conexion Admin RabbitMQ

Para entrar al panel de administración de rabbitmq se puede acceder desde `http://localhost:15671` con las credenciales

* **username**: guest
* **password**: guest


Estos servicios se pueden editar directamente el el archivo **docker-compose.yml**

## Pruebas unitarias

Las pruebas unitarias se diseñaron para cumplir un requisito de mas del **90%**, el cual se puede lograr gracias a la arquitectura del proyecto
