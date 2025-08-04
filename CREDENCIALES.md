# 🔐 Credenciales de Prueba para el Panel de Control

## 📋 **Cómo hacer Login:**

### **Usuarios de Prueba:**

#### 👨‍💼 **Super Administrador (Backend Real):**
- **Usuario:** `superadmin`
- **Contraseña:** `123456`
- **Aplicación:** `admin` (configurado automáticamente)
- **Descripción:** Usuario del backend real con acceso completo

#### 👨‍💼 **Administrador (Mock):**
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Aplicación:** `admin` (configurado automáticamente)
- **Descripción:** Usuario mock con acceso completo

#### 👨‍💻 **Vendedor (Mock):**
- **Usuario:** `vendedor1`
- **Contraseña:** `vend123`
- **Aplicación:** `admin` (configurado automáticamente)
- **Descripción:** Usuario mock con acceso a funciones de ventas

#### 🎯 **Usuario Demo (Mock):**
- **Usuario:** `demo`
- **Contraseña:** `demo123`
- **Aplicación:** `admin` (configurado automáticamente)
- **Descripción:** Usuario de demostración

---

## 🏢 **Aplicaciones Disponibles:**

1. **Panel Administrativo** (alias: `admin`)
2. **Sistema CRM** (alias: `crm`)
3. **Sistema ERP** (alias: `erp`)

---

## 🚀 **Pasos para hacer Login:**

1. **Ejecuta el proyecto:**
   ```bash
   npm run dev
   ```

2. **Abre el navegador en:**
   ```
   http://localhost:5173
   ```

3. **En la pantalla de login, ingresa:**
   - Usuario: `superadmin` (para backend real) o `admin` (para mock)
   - Contraseña: `123456` (para backend real) o `admin123` (para mock)
   - La aplicación se detecta automáticamente como "admin"

4. **Haz clic en "Iniciar Sesión"**

5. **¡Listo! Deberías ver el Dashboard**

---

## 🔧 **Notas Técnicas:**

### **Modo Mock (Actual):**
- El sistema intentará conectarse al backend real
- Si no encuentra el backend, automáticamente usa datos mock
- Los datos mock están en `src/services/mockService.js`

### **Modo Backend Real:**
- Configura la URL del backend en `src/services/api.js`
- El backend debe implementar los endpoints definidos
- Los datos vendrán de MongoDB según tus esquemas

---

## 🎨 **Lo que verás después del Login:**

1. **Dashboard Principal** con:
   - Estadísticas del usuario
   - Información de la aplicación
   - Roles asignados
   - Menús disponibles

2. **Menú Lateral** con opciones:
   - Dashboard
   - Administración
     - Usuarios
     - Aplicaciones
   - (Otras opciones según los roles)

3. **Funciones Disponibles:**
   - ✅ Ver información del usuario
   - ✅ Gestionar aplicaciones (CRUD)
   - ✅ Gestionar usuarios (CRUD)
   - 🚧 Gestionar roles (próximamente)
   - 🚧 Gestionar menús (próximamente)

---

## 🛠 **Personalización:**

Para agregar más usuarios de prueba, edita el archivo:
```
src/utils/mockData.js
```

Para cambiar las credenciales, edita el archivo:
```
src/services/mockService.js
```

---

## ⚠️ **Importante:**
- Estas credenciales son SOLO para desarrollo/testing
- En producción, conecta el backend real con seguridad adecuada
- Los tokens mock no son seguros, son solo para demostración
