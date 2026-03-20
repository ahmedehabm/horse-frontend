// src/i18n/locales/en.ts
export const en = {
  translation: {
    // Time
    time: {
      minutesAgo: "{{count}}m ago",
      hoursAgo: "{{count}}h ago",
      yesterday: "Yesterday",
    },

    sidebar: {
      adminPortal: "Admin Portal",
      userDashboard: "User Dashboard",
      administrator: "Administrator",
      user: "User",
      defaultName: "{{role}}",
      defaultAdminEmail: "admin@ostler.com",
      defaultUserEmail: "user@ostler.com",
    },

    // Navigation
    nav: {
      dashboard: "Dashboard",
      users: "Users",
      manageHorses: "Manage Horses",
      manageDevices: "Manage Devices",
      feeders: "Feeders",
      myFeeders: "My Feeders",
    },

    feedDialog: {
      title: "Feed {{name}}",
      amountLabel: "Amount (kg)",
      amountHint: "Enter a positive number (kg)",
      cancel: "Cancel",
      confirm: "Confirm Feed",
      notConnected: "Not connected to server.",
      invalidAmount: "Please enter a valid feeding amount (kg).",
      sendingFeed: "Sending feed command for {{name}}...",
      sendFailed: "Failed to send feed command. Please try again.",
      waitingForWeight: "Waiting for feeder weight data...",
      noWeightData: "Feeder weight data not available yet. Please wait.",
      availableWeight: "Available weight",
      exceedsAvailableWeight:
        "Requested {{requested}}kg exceeds available {{available}}kg",
      maxAmount: "Maximum: {{max}} kg",
    },

    // Common
    common: {
      welcomeBack: "Welcome Back",
      next: "Next",
      previous: "Previous",
      showing: "Showing {{from}} to {{to}} of {{total}}",
      cancel: "Cancel",
      device: "Device",
      loading: "Loading...",
      loadingMessage: "Please wait while we prepare everything",
      name: "Name",
      location: "Location",
      horse: "Horse",
      deviceName: "Device Name",
      uniqueDevice: "Must be unique for each device",
      uniqueUser: "Must be unique for each user",
      openUserActions: "Open user actions",
      deviceType: "Device Type",
      horseAttached: "Horse Attached",
      owner: "Owner",
      none: "None",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      deleteDescription:
        "This action cannot be undone. It is a permanent deletion.",

      updatedSuccess: "Updated successfully",
      deletedSuccess: "Deleted successfully",

      deletedFailed: "Failed to Delete",

      updatedFailed: "Failed to Update",
    },

    // Auth
    auth: {
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      login: "Log In",
      loginSuccess: "Logged in successfully",
      loginFailed: "Login failed",
      logoutSuccess: "Logged out successfully",
      logoutFailed: "Logout failed",
      signupSuccess: "Account successfully created!",
      signupFailed: "Signup failed",
      signOut: "Sign Out",
      loggingOut: "Logging out...",
    },

    // Users
    users: {
      title: "Users",
      signupUsers: "Signup Users",
      name: "Name",
      createUser: "Create User",
      createHorseForUser: "Create a horse for this user",

      noUsersFound: "No users found.",
      unnamedUser: "Unnamed User",
      updateUser: "Update user details",
      actions: "Actions",

      deleteTitle: "Delete user?",
      deleteWarning: "You are about to delete user:",
      horsesWillBeDeleted:
        "This will also delete {{count}} horse(s) owned by this user.",
      deleteIrreversible:
        "This action cannot be undone. The user and all their horses will be permanently deleted.",
      deleteAlsoDevices: "Also delete all connected devices",
      deleteDevicesHint:
        "If checked, all feeders and cameras assigned to this user's horses will also be permanently deleted.",
      deletedSuccess: "User deleted successfully",
      deletedFailed: "Failed to delete user",
    },

    // Devices
    devices: {
      title: "Devices",
      deviceType: "Device Type",
      feederType: "Feeder Type",
      horseAttached: "Horse Attached",
      feeder: "Feeder",
      camera: "Camera",
      myFeeders: "My Feeders",
      createCamera: "Create Camera",
      createCameraDevice: "Create Camera Device",
      addCameraDescription: "Add a new camera device to the system",

      createFeeder: "Create Feeder",
      updateFeeder: "Update Feeder",

      deviceCreatedSuccess: "Device created successfully",
      deviceUpdatedSuccess: "Device updated successfully",

      feederUpdatedSuccess: "Feeder updated successfully",

      createDeviceFailed: "Failed to create device",
      updateFeederFailed: "Failed to update feeder",

      unassignDeviceSuccessful: "Device has been successfully unassigned.",
      unassignDeviceFailed: "Failed to unassign the device.",

      forceUnassign: "Force Unassign",
      forceUnassignTitle: "Force Unassign Device",
      forceUnassignDescription:
        "You are about to unassign this device from its horse. This action cannot be undone automatically.",
      consequences: "Consequences:",

      consequenceFeeder1:
        "( {{horseName}} ) will no longer have a feeder assigned.",

      consequenceFeeder2: "All scheduled feedings for this horse will stop.",
      consequenceFeeder3:
        "Manual feeding will not be available until a new feeder is assigned.",

      consequenceCamera1:
        "( {{horseName}} ) will no longer have a camera assigned.",
      consequenceCamera2: "Live streaming for this horse will be unavailable.",
      consequenceCamera3: "Any active stream will be terminated immediately.",
      consequenceReassign:
        "You will need to manually reassign the device to a horse.",
      confirmUnassign: "Yes, Unassign Device",
    },

    // Feeder Types
    feederTypes: {
      manual: "Manual",
      MANUAL: "MANUAL",
      scheduled: "Scheduled",
      SCHEDULED: "SCHEDULED",
      scheduledAmount: "Scheduled Amount",
      morningTime: "Morning Time",
      dayTime: "Day Time",
      nightTime: "Night Time",
    },

    // Feeding
    feeding: {
      stopFeeding: "STOP FEEDING",
      stopping: "Stopping...",
      stopFailed: "Failed to stop feeding",
      stoppingFeeding: "Stopping feeding...",
      forceStop: "Force Stop",
      forceStopFailed: "Failed to force stop",
      forceStopped: "Feeding stopped manually",
      stopFeedingTitle: "Stop Feeding?",
      stopFeedingDescription:
        "This will send a stop command to the feeder device. The device will stop feeding {{horseName}}.",
      forceStopTitle: "Force Stop Feeding?",
      forceStopWarning: "⚠️ WARNING: This is a manual override.",
      forceStopDescription:
        "The device did not respond to the stop command. This will manually mark the feeding as stopped WITHOUT device confirmation.",
      forceStopNote:
        "Use this only if the device is offline or not responding.",
      lastFeed: "Last Feed",
    },

    feedNowBtn: {
      feedNow: "FEED NOW",
      feeding: "FEEDING…",
      noFeeder: "No feeder assigned",
      feedingInProgress: "Feeding in progress — please wait",
      feedHorse: "Feed {{horseName}}",
      feedingCompleted: "🎉 Feeding {{horseName}} completed successfully!",
      feedingFailed: "❌ Feeding {{horseName}} failed. {{errorMessage}}",
    },
    // Horses
    horses: {
      title: "Horses",
      createHorse: "Create Horse",
      createHorseForUser: "Create horse for user",
      name: "Name",
      namePlaceholder: "Thunder",
      breed: "Breed",
      breedPlaceholder: "Arabian",
      age: "Age",
      location: "Location",
      locationPlaceholder: "Stable A, Barn 3",
      image: "Image",
      feeder: "Feeder (Optional)",
      camera: "Camera (Optional)",

      deleteAlsoDevices: "Also delete connected devices (feeder/camera)",
      deleteDevicesHint:
        "If checked, the horse and any assigned feeder/camera will be deleted.",

      feederAlreadyAssigned:
        "This horse is already assigned to feeder: {{feederName}}. It is recommended to force unassign this device before reassigning.",

      cameraAlreadyAssigned:
        "This horse is already assigned to camera: {{cameraName}}. It is recommended to force unassign this device before reassigning.",

      noUnassignedFeeders: "No unassigned feeders available",
      noUnassignedCameras: "No unassigned cameras available",
      selectFeeder: "Select a feeder",
      selectCamera: "Select a camera",
      horseCreatedSuccess: "Horse created successfully",
      creatingForOwner: "Creating a horse for {{ownerName}}",
      addNewHorse: "Add a new horse to the system",
      cancel: "Cancel",
      create: "Create Horse",
    },

    feedingBar: {
      status: {
        pending: "Feed request pending",
        started: "Feeding started",
        running: "Feeding in progress",
        completed: "Feeding completed successfully",
        failed: "Feeding failed",
      },
      progressComplete: "{{progress}}% complete",
    },
    // Streaming
    streaming: {
      startStream: "START STREAM",
      viewStream: "VIEW STREAM",
      streamStopped: "Stream Stopped",
      starting: "STARTING...",
      liveStreamFor: "Live stream for {{horseName}}",
      noCamera: "No camera assigned",
    },

    // Pagination
    pagination: {
      horses: "horses",
      feeders: "feeders",
      devices: "devices",
      users: "users",
      page: "Page",
      of: "of",
    },

    validation: {
      // User Signup
      nameMinLength: "Name must be at least 2 characters",
      nameMaxLength: "Name must not exceed 50 characters",
      usernameMinLength: "Username must be at least 3 characters",
      passwordMinLength: "Password must be at least 8 characters",
      passwordMaxLength: "Password must not exceed 100 characters",
      providePasswordConfirm: "Please confirm your password",
      passwordsDoNotMatch: "Passwords do not match",

      // Horse Creation
      horseNameMinLength: "Horse name must be at least 2 characters",
      horseNameMaxLength: "Horse name must not exceed 50 characters",
      breedMinLength: "Breed must be at least 2 characters",
      breedMaxLength: "Breed must not exceed 50 characters",
      ageRequired: "Age is required",
      ageInteger: "Age must be an integer",
      ageMinValue: "Age must be 1 or greater",
      ageMaxValue: "Age must be 40 or less",
      locationMinLength: "Location must be at least 2 characters",
      locationMaxLength: "Location must not exceed 100 characters",
      validDeviceUUID: "Must be a valid Device UUID",
      ownerIdRequired: "Owner ID is required",
      validUUID: "Must be a valid UUID",
      imageSizeLimit: "Image must be less than 5MB",
      imageFormatSupport:
        "Only .jpg, .jpeg, .png and .webp formats are supported",

      // Device Creation
      deviceNameMinLength: "Device name must be at least 5 characters",
      deviceNameMaxLength: "Device name must not exceed 50 characters",

      // Feeder
      amountMinValue: "Amount must be at least 0.1 kg",
      amountMaxValue: "Amount cannot exceed 50 kg",
      timeOnTheHour: "Must be on the hour (e.g., 04:00, 8:00)",
      scheduledAmountRequired:
        "Scheduled Amount is required for Scheduled feeders",
      atLeastOneTime:
        "At least one feeding time must be set for SCHEDULED feeders",
      timeAlreadyUsed: "This time is already used in {{field}}",
      duplicateTimes: "Feeding times cannot be duplicated",
    },
  },
};
