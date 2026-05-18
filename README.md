# Dike — Comparte · Presta · Dona

> Una plataforma comunitaria para dar una segunda vida a los objetos que ya no usas.

---

## ¿Qué es Dike?

Dike nació con una idea simple: los objetos que acumulan polvo en tu casa pueden ser exactamente lo que alguien más necesita. En lugar de comprar y tirar, ¿por qué no compartir?

Es una aplicación pensada para comunidades reales — vecinos, amigos, compañeros de trabajo — donde cualquiera puede publicar lo que tiene, pedir lo que necesita, y construir relaciones de confianza alrededor del intercambio.

Sin dinero de por medio. Sin plataformas frías. Solo personas ayudando a personas.

---

## Capturas de pantalla



*Las capturas llegarán pronto.*

---

## Funcionalidades principales

- **Publicar objetos** — Dona, presta o intercambia lo que ya no usas, con foto, descripción y etiquetas.
- **Explorar el feed** — Filtra por tipo (donación, préstamo, intercambio) y encuentra lo que buscas.
- **Sistema de solicitudes** — Pide un artículo, negocia los detalles y haz seguimiento del estado.
- **Mensajería directa** — Habla con quien publicó el artículo antes de acordar el intercambio.
- **Valoraciones de usuarios** — Después de cada intercambio, deja una reseña para construir reputación.
- **Perfiles personalizados** — Foto, bio y historial de actividad.

---

## Stack tecnológico


 Framework UI | React 19 
 Routing | React Router DOM 7 
 Build tool | Vite 7 + SWC 
 Estilos | Tailwind CSS 4 
 Componentes | shadcn/ui + Radix UI 
 HTTP client  Axios 
 Iconos  Lucide React 

---

## Instalación y uso local

### Requisitos previos

- Node.js 18 o superior
- El backend [DikeBack](../DikeBack) corriendo en `localhost:3001`

### Pasos

```bash
# 1. Clona el repositorio



# 2. Instala las dependencias


# 3. Inicia el servidor de desarrollo

```

`.

### Arrancar frontend + backend a la vez

Si tienes el backend en el directorio hermano `DikeBack/`:

```bash
npm run dev-start
```

Este comando levanta ambos servidores en paralelo con `concurrently`.

---

## Estructura del proyecto

```
src/
├── features/auth/       # Páginas de login y registro
├── pages/               # Vistas principales (Feed, Chat, Perfil…)
├── components/          # Componentes reutilizables y UI base
├── context/             # Estado global de autenticación (JWT)
├── services/            # Cliente Axios y endpoints de la API
├── layouts/             # Layouts compartidos
└── routes/              # Definición de rutas
```

---



## ¿Quieres contribuir?



1. Haz un fork del repositorio
2. Crea tu rama: `git checkout -b feature/mi-mejora`
3. Haz commit de tus cambios: `git commit -m 'feat: descripción del cambio'`
4. Sube la rama: `git push origin feature/mi-mejora`
5. Abre un Pull Request

---

## Licencia

MIT © 2026 — Dike
