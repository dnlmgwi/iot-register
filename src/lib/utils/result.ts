export type Result<T, E = Error> = { kind: 'success'; data: T } | { kind: 'error'; error: E };
