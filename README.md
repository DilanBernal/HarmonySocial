# Este es el proyecto general de la aplicación

Estructura a seguir para el front (MVVM):
```
/src
│
├── models                     # Modelos (como User.ts, Product.ts)
│
├── services                   # Acceso a APIs u otros recursos
│
├── screens
│   └── Login
│       ├── LoginScreen.tsx    # View (solo UI)
│       ├── LoginViewModel.ts  # Lógica de presentación y binding
│       └── LoginModel.ts      # Modelo específico de vista (opcional)
│
├── components                 # Componentes reutilizables
│
├── navigation                 # Navegación
│
├── hooks                      # Hooks personalizados (ej: useAuth)
│
├── utils                      # Funciones auxiliares
│
└── App.tsx
```
