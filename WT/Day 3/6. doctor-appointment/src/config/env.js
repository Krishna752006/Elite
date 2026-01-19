function toBool(v, defVal) {
  if (v === undefined) return defVal;
  return String(v).toLowerCase() === 'true';
}

export const env = {
  PORT: Number(process.env.PORT || 3000),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doctor_appointments',
  ENABLE_TEST_ROUTES: toBool(process.env.ENABLE_TEST_ROUTES, true)
};
