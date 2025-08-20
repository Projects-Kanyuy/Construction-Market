export function paginate({ page = 1, limit = 20 }) {
  const skip = (Number(page) - 1) * Number(limit);
  return { skip, limit: Number(limit) };
}
