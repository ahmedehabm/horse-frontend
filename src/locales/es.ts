// src/i18n/locales/es.ts
export const es = {
  translation: {
    // Time
    time: {
      minutesAgo: "hace {{count}}m",
      hoursAgo: "hace {{count}}h",
      yesterday: "Ayer",
    },
    // Navigation
    nav: {
      dashboard: "Panel",
      users: "Usuarios",
      manageHorses: "Gestionar Caballos",
      manageDevices: "Gestionar Dispositivos",
      feeders: "Comederos",
      myFeeders: "Mis Comederos",
    },
    // Common
    common: {
      welcomeBack: "Bienvenido de Nuevo",
      next: "Siguiente",
      previous: "Anterior",
      showing: "Mostrando {{from}} a {{to}} de {{total}}",
      cancel: "Cancelar",
      loading: "Cargando...",
      loadingMessage: "Por favor espera mientras preparamos todo",
      name: "Nombre",
      device: "dispositivo",
      location: "Ubicación",
      deviceName: "Nombre del Dispositivo",
      uniqueDevice: "Debe ser único para cada dispositivo",
      uniqueUser: "Debe ser único para cada usuario",
      openUserActions: "Abrir acciones de usuario",
      deviceType: "Tipo de dispositivo",
      horseAttached: "Caballo asignado",
      owner: "Propietario",
      none: "Ninguna",
      actions: "Acciones",

      edit: "Editar",
      updatedSuccess: "Actualizado exitosamente",
      updatedFailed: "Error al actualizar",
    },
    sidebar: {
      adminPortal: "Portal de Administración",
      userDashboard: "Panel de Usuario",
      administrator: "Administrador",
      user: "Usuario",
      defaultName: "{{role}}",
      defaultAdminEmail: "admin@ostler.com",
      defaultUserEmail: "user@ostler.com",
    },
    // Auth
    auth: {
      username: "Nombre de usuario",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      login: "Iniciar Sesión",
      loginSuccess: "Inicio de sesión exitoso",
      loginFailed: "Error al iniciar sesión",
      logoutSuccess: "Sesión cerrada correctamente",
      logoutFailed: "Error al cerrar sesión",
      signupSuccess: "¡Cuenta creada exitosamente!",
      signupFailed: "Error al registrarse",
      signOut: "Cerrar sesión",
      loggingOut: "Cerrando sesión...",
    },
    // Users
    users: {
      title: "Usuarios",
      signupUsers: "Registrar Usuarios",
      name: "Nombre",
      createUser: "Crear Usuario",
      createHorseForUser: "Crear un caballo para este usuario",
      noUsersFound: "No se encontraron usuarios.",
      unnamedUser: "Usuario sin nombre",
      updateUser: "Actualizar detalles del usuario",
      actions: "Acciones",
    },
    feedDialog: {
      title: "Alimentar a {{name}}",
      amountLabel: "Cantidad (kg)",
      amountHint: "Ingrese un número positivo (kg)",
      cancel: "Cancelar",
      confirm: "Confirmar Alimentación",
      notConnected: "No conectado al servidor.",
      invalidAmount:
        "Por favor ingrese una cantidad de alimentación válida (kg).",
      sendingFeed: "Enviando comando de alimentación para {{name}}...",
      sendFailed:
        "Error al enviar comando de alimentación. Por favor intente de nuevo.",

      waitingForWeight: "Esperando datos de peso del comedero...",
      noWeightData:
        "Datos de peso del comedero no disponibles aún. Por favor espere.",
      availableWeight: "Peso disponible",
      exceedsAvailableWeight:
        "{{requested}}kg solicitado excede {{available}}kg disponible",
      maxAmount: "Máximo: {{max}} kg",
    },
    // Devices
    devices: {
      title: "Dispositivos",
      feederType: "Tipo de alimentador",
      deviceType: "Tipo de Dispositivo",
      horseAttached: "Caballo Asignado",
      feeder: "Comedero",
      camera: "Cámara",
      myFeeders: "Mis Comederos",
      createCamera: "Crear Cámara",
      createCameraDevice: "Crear Dispositivo de Cámara",
      addCameraDescription: "Agregar un nuevo dispositivo de cámara al sistema",
      createFeeder: "Crear Comedero",
      updateFeeder: "Actualizar Comedero",
      deviceCreatedSuccess: "Dispositivo creado exitosamente",
      feederUpdatedSuccess: "Comedero actualizado exitosamente",
      createDeviceFailed: "Error al crear el dispositivo",
      updateFeederFailed: "Error al actualizar el comedero",

      unassignDeviceSuccessful:
        "El dispositivo ha sido desasignado correctamente.",
      unassignDeviceFailed: "Error al desasignar el dispositivo.",

      forceUnassign: "Forzar Desasignación",
      forceUnassignTitle: "Forzar Desasignación del Dispositivo",
      forceUnassignDescription:
        "Está a punto de desasignar este dispositivo de su caballo. Esta acción no se puede deshacer automáticamente.",
      consequences: "Consecuencias:",
      consequenceFeeder1:
        "( {{horseName}} ) ya no tendrá un comedero asignado.",

      consequenceFeeder2:
        "Todas las alimentaciones programadas para este caballo se detendrán.",
      consequenceFeeder3:
        "La alimentación manual no estará disponible hasta que se asigne un nuevo comedero.",
      consequenceCamera1: "( {{horseName}} ) ya no tendrá una cámara asignada.",

      consequenceCamera2:
        "La transmisión en vivo de este caballo no estará disponible.",
      consequenceCamera3:
        "Cualquier transmisión activa se terminará inmediatamente.",
      consequenceReassign:
        "Deberá reasignar manualmente el dispositivo a un caballo.",
      confirmUnassign: "Sí, Desasignar Dispositivo",
    },
    // Feeder Types
    feederTypes: {
      manual: "Manual",
      scheduled: "Programado",
      SCHEDULED: "PROGRAMADO",
      scheduledAmount: "Cantidad Programada",
      morningTime: "Hora de la Mañana",
      dayTime: "Hora del Día",
      nightTime: "Hora de la Noche",
    },
    // Feeding
    feeding: {
      lastFeed: "Últ.",
    },
    feedNowBtn: {
      feedNow: "ALIMENTAR AHORA",
      feeding: "ALIMENTANDO…",
      noFeeder: "Sin comedero asignado",
      feedingInProgress: "Alimentación en progreso — por favor espere",
      feedHorse: "Alimentar a {{horseName}}",
      feedingCompleted:
        "🎉 ¡Alimentación de {{horseName}} completada exitosamente!",
      feedingFailed: "❌ Error al alimentar a {{horseName}}. {{errorMessage}}",
    },
    // Horses
    horses: {
      title: "Caballos",
      createHorse: "Crear Caballo",
      createHorseForUser: "Crear caballo para usuario",
      name: "Nombre",
      namePlaceholder: "Trueno",
      breed: "Raza",
      breedPlaceholder: "Árabe",
      age: "Edad",
      location: "Ubicación",
      locationPlaceholder: "Establo A, Granero 3",
      image: "Imagen",
      feeder: "Comedero (Opcional)",
      camera: "Cámara (Opcional)",
      noUnassignedFeeders: "No hay comederos sin asignar disponibles",
      noUnassignedCameras: "No hay cámaras sin asignar disponibles",
      selectFeeder: "Seleccionar un comedero",
      selectCamera: "Seleccionar una cámara",
      horseCreatedSuccess: "Caballo creado exitosamente",
      creatingForOwner: "Creando un caballo para {{ownerName}}",
      addNewHorse: "Agregar un nuevo caballo al sistema",
      cancel: "Cancelar",
      create: "Crear Caballo",
    },
    feedingBar: {
      status: {
        pending: "Solicitud de alimentación pendiente",
        started: "Alimentación iniciada",
        running: "Alimentación en progreso",
        completed: "Alimentación completada exitosamente",
        failed: "Alimentación fallida",
      },
      progressComplete: "{{progress}}% completado",
    },
    // Streaming
    streaming: {
      startStream: "INICIAR TRANSMISIÓN",
      viewStream: "VER TRANSMISIÓN",
      streamStopped: "Transmisión Detenida",
      starting: "INICIANDO...",
      liveStreamFor: "Transmisión en vivo para {{horseName}}",
      noCamera: "No hay cámara asignada",
    },
    // Pagination
    pagination: {
      horses: "caballos",
      feeders: "comedores",
      devices: "dispositivos",
      users: "usuarios",
      page: "Página",
      of: "de",
    },
    validation: {
      // User Signup
      nameMinLength: "El nombre debe tener al menos 2 caracteres",
      nameMaxLength: "El nombre no debe exceder 50 caracteres",
      usernameMinLength:
        "El nombre de usuario debe tener al menos 3 caracteres",
      passwordMinLength: "La contraseña debe tener al menos 8 caracteres",
      passwordMaxLength: "La contraseña no debe exceder 100 caracteres",
      providePasswordConfirm: "Por favor confirme su contraseña",
      passwordsDoNotMatch: "Las contraseñas no coinciden",
      // Horse Creation
      horseNameMinLength:
        "El nombre del caballo debe tener al menos 2 caracteres",
      horseNameMaxLength: "El nombre del caballo no debe exceder 50 caracteres",
      breedMinLength: "La raza debe tener al menos 2 caracteres",
      breedMaxLength: "La raza no debe exceder 50 caracteres",
      ageRequired: "La edad es requerida",
      ageInteger: "La edad debe ser un número entero",
      ageMinValue: "La edad debe ser 1 o mayor",
      ageMaxValue: "La edad debe ser 40 o menos",
      locationMinLength: "La ubicación debe tener al menos 2 caracteres",
      locationMaxLength: "La ubicación no debe exceder 100 caracteres",
      validDeviceUUID: "Debe ser un UUID de dispositivo válido",
      ownerIdRequired: "El ID del propietario es requerido",
      validUUID: "Debe ser un UUID válido",
      imageSizeLimit: "La imagen debe ser menor a 5MB",
      imageFormatSupport: "Solo se admiten formatos .jpg, .jpeg, .png y .webp",
      // Device Creation
      deviceNameMinLength:
        "El nombre del dispositivo debe tener al menos 5 caracteres",
      deviceNameMaxLength:
        "El nombre del dispositivo no debe exceder 50 caracteres",
      // Feeder
      amountMinValue: "La cantidad debe ser al menos 0.1 kg",
      amountMaxValue: "La cantidad no puede exceder 50 kg",
      timeOnTheHour: "Debe ser en punto (ej: 04:00, 8:00)",
      scheduledAmountRequired:
        "La cantidad programada es requerida para comederos programados",
      atLeastOneTime:
        "Debe establecerse al menos un horario de alimentación para comederos PROGRAMADOS",
      timeAlreadyUsed: "Este horario ya está usado en {{field}}",
      duplicateTimes: "Los horarios de alimentación no pueden estar duplicados",
    },
  },
};
