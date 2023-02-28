export const GET = 'GET' as const;
export const POST = 'POST' as const;
export const DELETE = 'DELETE' as const;
export type HttpMethod = typeof GET | typeof POST | typeof DELETE;
