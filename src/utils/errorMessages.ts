// src/utils/errorMessages.ts
export const errorMessages = {
    unauthorized: 'Hozzáférés megtagadva. Nincs megfelelő jogosultsága.',
    unauthenticated: 'A kért művelethez be kell jelentkeznie.',
    invalidCredentials: 'Hibás e-mail cím vagy jelszó.',
    serverError: 'Váratlan szerverhiba történt. Kérjük, próbálja újra később.',
    validationError: 'Érvénytelen vagy hiányos adatok.',
    
    // Szerepkör-specifikus üzenetek
    customerOnly: 'Ez a funkció csak vásárlók számára érhető el.',
    adminOnly: 'Ez a funkció csak adminisztrátorok számára érhető el.',
    employeeOrAdminOnly: 'Ez a funkció csak bolt alkalmazottak és adminisztrátorok számára érhető el.'
  };