# Documentación API Prueba Backend Symphony Semi-senior

Este proyecto es un backend desarrollado con **NestJS** y **TypeScript** para gestionar servicios y asignarlos a usuarios. Implementa buenas prácticas de desarrollo, siguiendo una arquitectura modular y utilizando TypeORM para la interacción con una base de datos **PostgreSQL**.

No se incluye un comando específico para la migración de la base de datos, ya que el código está configurado con la sincronización automática. Esto significa que, después de realizar la configuración inicial (mencionada más adelante) y ejecutar el comando para iniciar el servidor, las tablas se generarán automáticamente.

## Funcionalidades

- **Gestión de Usuarios**: Permite registrar y autenticar usuarios mediante JWT, asegurando el acceso seguro a la API.
- **Gestión de Servicios**: Proporciona endpoints para crear, listar y eliminar servicios, permitiendo la asignación de estos a los usuarios.
- **Documentación de la API**: La API está documentada utilizando **Swagger**, facilitando la interacción y pruebas de los endpoints.
- **Eliminación Lógica**: Se utiliza eliminación lógica con el campo `deletedAt`, permitiendo mantener un registro de los servicios eliminados sin perder datos históricos.

## Tecnologías Utilizadas

- **NestJS**: Framework para construir aplicaciones del lado del servidor.
- **TypeScript**: Superset de JavaScript que agrega tipado estático.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional.
- **TypeORM**: ORM que facilita la interacción con la base de datos.
- **Swagger**: Herramienta para documentar y probar APIs REST.

Este proyecto ha sido diseñado para cumplir con los requisitos establecidos en la prueba técnica, demostrando habilidades clave en el desarrollo backend en un entorno profesional.

## Requisitos

- Node.js (v22.0.0 o superior)
- PostgreSQL

## Pasos para clonar y ejecutar el proyecto

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Skpow1234/BackendSimphonyPrueba.git

2. Accede al directorio del proyecto:

   ```bash
   cd PruebaBackendSymphony

3. En la raiz del proyecto crear un archivo .env con la siguiente estructura

   ```bash
   DB_HOST=
   DB_PORT=
   DB_USERNAME=
   DB_PASSWORD=
   DB_NAME=
   JWT_SECRET=
   JWT_EXPIRES_IN=1h


4. Instala las dependencias

   ```bash
   npm install 

5. Ejecuta los seeders para cargar datos iniciales:

   ```bash
   ts-node seed.ts

6. Inicia el servidor

   ```bash
   npm run start:dev

7. Para ejecutar las pruebas unitarias:

   ```bash
   npm run test

## Instrucciones para acceder a la documentación de Swagger

Una vez que el servidor esté en ejecución, puedes acceder a la documentación de Swagger en la siguiente URL:

   ```bash
   http://localhost:3000/api

