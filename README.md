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

![image](https://github.com/user-attachments/assets/02098252-1f80-48e4-ae66-f6ba9b677861)

![image](https://github.com/user-attachments/assets/adad6d45-a209-4e9e-9608-3e33859c6f0d)

## Conexiones por defecto en local con docker compose

* Front: https://localhost:4002
* Back: http://localhost:4003
* Db adminer: http://localhost:4001

## Arquitectura del proyecto

![image](https://github.com/user-attachments/assets/adad721d-3c16-4169-aff4-cbcf82bbb313)

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

![image](https://github.com/user-attachments/assets/f3646cac-f30b-4707-913b-6c963097aa83)

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

## Base de datos

![image](https://github.com/user-attachments/assets/516e846b-9385-481f-a874-609df0e3cb7a)

## Servicios adicionales

### Conexión con base de datos

![image](https://github.com/user-attachments/assets/be2c179b-ffdf-4f05-9e28-8a5e19d51696)

![image](https://github.com/user-attachments/assets/6c84bf97-acac-459b-a576-4826e7f32973)

Para realizar la conexión con la base de datos se dispone del servicio Adminer el cual se puede acceder desde `http://localhost:4001` mediante las siguientes credenciales por defecto

* **server**: postgres
* **user**: postgres
* **password**: postgres
* **database**: restaurant_db


### Conexion Admin RabbitMQ

![image](https://github.com/user-attachments/assets/c0d35793-528e-4044-8df1-220913d2ffc4)

![image](https://github.com/user-attachments/assets/d81145b8-475c-4c1e-afe1-6ac836198a7c)

Para entrar al panel de administración de rabbitmq se puede acceder desde `http://localhost:15671` con las credenciales

* **username**: guest
* **password**: guest


Estos servicios se pueden editar directamente el el archivo **docker-compose.yml**

## Pruebas unitarias

Las pruebas unitarias se diseñaron para cumplir un requisito de mas del **90%**, el cual se puede lograr gracias a la arquitectura del proyecto

![image](https://github.com/user-attachments/assets/b60c109d-50a6-44e1-aa2f-55488563dc58)

![image](https://github.com/user-attachments/assets/f639b9e8-2229-46c2-8547-0cc4149f1fa2)

![image](https://github.com/user-attachments/assets/6056515c-6069-48e0-ab01-6f65277ef0e4)
