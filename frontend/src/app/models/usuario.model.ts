export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface Usuario {
    id: string;
    email: string;
    nome: string;
    ativo: boolean;
    admin: boolean;
}

export interface UsuarioRequest {
    email: string;
    senha: string;
}

// Para compatibilidade com classes existentes
export class UsuarioRequestImpl implements UsuarioRequest {
    email: string = '';
    senha: string = '';
}

export class UsuarioImpl implements Usuario {
    id: string = '';
    email: string = '';
    nome: string = '';
    ativo: boolean = false;
    admin: boolean = false;
}
