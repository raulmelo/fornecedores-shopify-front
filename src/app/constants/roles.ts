export type ROLES_TYPES = "MASTER" | "ADMIN" | "FORNECEDOR" | "VISUALIZADOR" | null | undefined;

export const ROLES = {
    MASTER: "MASTER",
    ADMIN: "ADMIN",
    FORNECEDOR: "FORNECEDOR",
    VISUALIZADOR: "VISUALIZADOR",
} as const