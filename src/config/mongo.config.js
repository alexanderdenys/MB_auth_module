export const getMongoUri = () => {
  const result = process.env.DB_URI;
  return result;
};
