# Dikë — Comparte · Presta · Dona

Una plataforma comunitaria para dar una segunda vida a los objetos que ya no usas.

---

## ¿Qué es Dikë?

Dikë nació con una idea simple: los objetos que acumulan polvo en tu casa pueden ser exactamente lo que alguien más necesita. En lugar de comprar y tirar, ¿por qué no compartir?

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

| Utilidad |  Tecnología |
|------|------------|
| Framework UI | <img src="https://cdn.simpleicons.org/react/61DAFB" width="14" height="14"/> React 19 |
| Routing | <img src="https://cdn.simpleicons.org/reactrouter/CA4245" width="14" height="14"/> React Router DOM 7 |
| Build tool | <img src="https://cdn.simpleicons.org/vite/646CFF" width="14" height="14"/> Vite 7 + SWC |
| Estilos | <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="14" height="14"/> Tailwind CSS 4 |
| Componentes | <img src="https://cdn.simpleicons.org/shadcnui/000000" width="14" height="14"/> shadcn/ui + Radix UI |
| HTTP client | <img src="https://cdn.simpleicons.org/axios/5A29E4" width="14" height="14"/> Axios |
| Iconos | <img src="https://cdn.simpleicons.org/lucide/F56565" width="14" height="14"/> Lucide React |

---

## Instalación y uso local

### Requisitos previos



### Pasos


La app estará disponible en `http://localhost:5173`.

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

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run dev-start` | Frontend + backend en paralelo |


---

## ¿Quieres contribuir?

Las contribuciones son bienvenidas. Si encuentras un bug o tienes una idea, abre un issue primero para discutirlo antes de enviar un pull request.

1. Haz un fork del repositorio
2. Crea tu rama: `git checkout -b feature/mi-mejora`
3. Haz commit de tus cambios: `git commit -m 'feat: descripción del cambio'`
4. Sube la rama: `git push origin feature/mi-mejora`
5. Abre un Pull Request

---

## Licencia

MIT © 2026 — Dike
