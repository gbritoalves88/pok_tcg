import requests
import imagehash
from PIL import Image
from io import BytesIO
import sys
import os
import time

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import connect_to_mongo
from app.models.carta import salvar_carta_catalogo, limpar_catalogo

def popular_catalogo():
    print("=" * 60)
    print("📦 POPULANDO CATÁLOGO DE CARTAS POKÉMON")
    print("=" * 60)

    # Conecta ao MongoDB
    print("📦 Conectando ao MongoDB...")
    connect_to_mongo()

    # Limpa o catálogo existente
    limpar_catalogo()
    print("✅ Catálogo limpo")

    # 1. Busca os 3 conjuntos (sets) mais recentes
    sets_url = "https://api.pokemontcg.io/v2/sets"
    sets_params = {"orderBy": "-releaseDate", "pageSize": 3} # Pega os 3 mais recentes

    print(f"🌐 Buscando os conjuntos mais recentes...")
    response_sets = requests.get(sets_url, params=sets_params)

    if response_sets.status_code != 200:
        print(f"❌ Erro ao buscar conjuntos: {response_sets.status_code}")
        return

    sets_data = response_sets.json().get("data", [])
    if not sets_data:
        print("❌ Nenhum conjunto encontrado.")
        return

    print(f"✅ Conjuntos encontrados: {len(sets_data)}")
    print("-" * 60)

    todas_cartas = []
    for set_info in sets_data:
        set_id = set_info["id"]
        set_name = set_info["name"]
        print(f"📚 Buscando cartas do set: {set_name} ({set_id})")

        # 2. Para cada set, busca as cartas com paginação
        cards_url = "https://api.pokemontcg.io/v2/cards"
        cards_params = {"q": f"set.id:{set_id}", "pageSize": 250}

        page = 1
        while True:
            params = cards_params.copy()
            params["page"] = page
            print(f"  📄 Buscando página {page}...")
            response_cards = requests.get(cards_url, params=params)

            if response_cards.status_code != 200:
                print(f"  ❌ Erro ao buscar página {page}: {response_cards.status_code}")
                break

            data = response_cards.json()
            cards = data.get("data", [])

            if not cards:
                break

            todas_cartas.extend(cards)
            print(f"    ✅ Página {page}: +{len(cards)} cartas (total do set: {len(todas_cartas)})")

            # Verifica se tem próxima página
            total_count = data.get("totalCount", 0)
            if len(todas_cartas) >= total_count:
                break

            page += 1
            time.sleep(0.5)  # Pausa para não sobrecarregar a API

        print(f"  ✅ Total de cartas para {set_name}: {len([c for c in todas_cartas if c['set']['id'] == set_id])}")

    print(f"✅ Total de cartas encontradas: {len(todas_cartas)}")
    print("-" * 60)

    for i, card in enumerate(todas_cartas, 1):
        try:
            img_url = card["images"]["small"]
            img_response = requests.get(img_url)
            img = Image.open(BytesIO(img_response.content))

            hash_value = str(imagehash.phash(img))

            carta_data = {
                "id": card["id"],
                "nome": card["name"],
                "set_id": card["set"]["id"],
                "set_nome": card["set"]["name"],
                "hash": hash_value,
                "imagem_url": img_url
            }
            salvar_carta_catalogo(carta_data)

            print(f"  ✅ [{i}/{len(todas_cartas)}] {card['name']} ({card['set']['name']})")

            if i % 10 == 0:
                time.sleep(0.5)

        except Exception as e:
            print(f"  ❌ [{i}/{len(todas_cartas)}] Erro: {card.get('name', 'desconhecida')} - {e}")

    print("-" * 60)
    print(f"🎉 Catálogo populado com {len(todas_cartas)} cartas das coleções mais recentes!")
    print("=" * 60)

if __name__ == "__main__":
    popular_catalogo()