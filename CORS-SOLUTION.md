# 🛠 Solución para Error de CORS

## ✅ **Configuración Aplicada:**

1. **Proxy configurado en Vite** (`vite.config.js`)
2. **URL de API actualizada** (`.env`) a `/api`
3. **Logs de proxy habilitados** para debugging

## 🔄 **Para aplicar los cambios:**

### **IMPORTANTE: Reinicia el servidor de desarrollo**

1. **Detén el servidor actual:**
   - En la terminal donde corre `npm run dev`
   - Presiona `Ctrl + C`

2. **Inicia nuevamente:**
   ```bash
   npm run dev
   ```

3. **Verifica que funcione:**
   - Ve a `http://localhost:5173`
   - Haz login con `superadmin / 123456`
   - En la consola del navegador deberías ver logs como:
     ```
     API Request: POST /api/auth/login
     Sending Request to the Target: POST /api/auth/login
     Received Response from the Target: 200 /api/auth/login
     ```

## 🔧 **Cómo funciona el Proxy:**

- **Frontend:** `http://localhost:5173`
- **Petición:** `POST /api/auth/login`
- **Proxy redirige a:** `http://localhost:3001/api/auth/login`
- **Sin CORS:** El navegador ve todo como mismo origen

## 🚨 **Si aún tienes problemas:**

### **Opción 2: Configurar CORS en tu Backend**

Si el proxy no funciona, agrega esto a tu backend (Express.js):

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-App-Alias']
}));
```

## 📝 **Notas:**

- **Desarrollo:** Usa proxy de Vite (más simple)
- **Producción:** Configura CORS en backend
- **Debugging:** Revisa consola del navegador y terminal de Vite
