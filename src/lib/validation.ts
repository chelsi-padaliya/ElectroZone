export const validate = {
  email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone: string) => /^\d{10}$/.test(phone.replace(/\D/g, "")),
  password: (password: string) => password.length >= 6,
  name: (name: string) => name.trim().length >= 2,
  required: (value: string) => value.trim().length > 0,
  number: (value: string) => !isNaN(Number(value)) && Number(value) >= 0,
};
