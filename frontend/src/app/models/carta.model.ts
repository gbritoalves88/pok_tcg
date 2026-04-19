// carta.model.ts

// ========== REQUISIÇÃO ==========
export interface ReconhecerRequest {
    imagem_base64: string;
}

// ========== RESPOSTAS ==========
export interface CartaCatalogo {
    id: string;
    nome: string;
    set_id: string;
    set_nome: string;
    hash: string;
    imagem_url: string;
}

export interface ReconhecerResponse {
    encontrada: boolean;
    confianca?: 'excelente' | 'boa' | 'media';
    mensagem: string;
    distancia?: number;
    carta?: CartaCatalogo;
}

// ========== CARTAS DO USUÁRIO (BOARD) ==========
export interface CartaUsuario {
    id?: string;
    usuario_id: string;
    carta_id: string;
    hash_original: string;
    imagem_original_base64: string;
    condicao?: string;
    observacao?: string;
    data_adicao: string;
}

// ========== MOCK (para compatibilidade com o dashboard atual) ==========
export interface CartaMock {
    nome: string;
    colecao: string;
    numero: string;
    raridade: string;
}

// ========== FUNÇÃO DE CONVERSÃO ==========
// Converte a resposta do backend para o formato do dashboard
export function converterParaCartaMock(carta: CartaCatalogo): CartaMock {
    return {
        nome: carta.nome,
        colecao: carta.set_nome,
        numero: carta.id.split('-')[1] || '---',
        raridade: 'rara' // valor padrão, ajustar se tiver no backend
    };
}
