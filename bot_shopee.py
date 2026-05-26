import asyncio
import telegram
import requests
import hashlib
import time
import schedule
import random

TELEGRAM_TOKEN = 'SEU_TOKEN_DO_BOTFATHER'
CANAL_ID = 'https://t.me/afiliadosshopeebrl'

# Pega esses dados no painel Shopee Afiliados > API
PARTNER_ID = 12345678  # Seu Partner ID
PARTNER_KEY = 'SUA_KEY_AQUI'  # Sua Partner Key
SHOP_ID = None  # Deixa None pra buscar geral

def gerar_assinatura_shopee():
    timestamp = int(time.time())
    base_string = f"{PARTNER_ID}{timestamp}{PARTNER_KEY}"
    sign = hashlib.sha256(base_string.encode('utf-8')).hexdigest()
    return timestamp, sign

def buscar_ofertas_shopee():
    timestamp, sign = gerar_assinatura_shopee()
    url = 'https://open-api.affiliate.shopee.com.br/graphql'
    
    # Query pra pegar produtos de eletrônicos em oferta
    query = """
    query {
      productOfferV2(keyword: "fone bluetooth smartwatch ssd notebook", limit: 20, sortType: 2) {
        nodes {
          productName
          priceMin
          priceMax
          priceDiscountRate
          imageUrl
          offerLink
          ratingStar
        }
      }
    }
    """
    
    headers = {
        'Authorization': f'SHA256 Credential={PARTNER_ID}, Timestamp={timestamp}, Signature={sign}',
        'Content-Type': 'application/json'
    }
    
    try:
        r = requests.post(url, json={'query': query}, headers=headers, timeout=15)
        data = r.json()
        produtos = data['data']['productOfferV2']['nodes']
        
        # Filtra só os com desconto bom
        ofertas_boas = []
        for p in produtos:
            if p['priceDiscountRate'] and p['priceDiscountRate'] >= 20:  # 20%+ de desconto
                ofertas_boas.append({
                    "nome": p['productName'][:90],
                    "preco": f"R${p['priceMin']}",
                    "desconto": f"{int(p['priceDiscountRate'])}% OFF",
                    "link": p['offerLink'],  # Já vem com seu link de afiliado
                    "imagem": p['imageUrl'],
                    "nota": p['ratingStar']
                })
        return ofertas_boas
    except Exception as e:
        print(f"Erro API Shopee: {e}")
        return []

async def enviar_oferta():
    bot = telegram.Bot(token=TELEGRAM_TOKEN)
    ofertas = buscar_ofertas_shopee()
    
    if not ofertas:
        print("Sem ofertas boas agora")
        return
        
    o = random.choice(ofertas)
    
    texto = f"🧡 *SHOPEE ACHADO* 🧡\n\n" \
            f"*{o['nome']}*\n\n" \
            f"💥 {o['desconto']}\n" \
            f"💰 *A partir de {o['preco']}*\n" \
            f"⭐ Nota: {o['nota']}/5.0\n\n" \
            f"👉 [COMPRAR NA SHOPEE]({o['link']})\n\n" \
            f"🔥 Corre que acaba rápido!\n" \
            f"_Compre pelo link e apoie o canal_"
    
    try:
        await bot.send_photo(
            chat_id=CANAL_ID,
            photo=o['imagem'],
            caption=texto,
            parse_mode='Markdown'
        )
        print(f"Enviado: {o['nome']}")
    except Exception as e:
        print(f"Erro ao postar: {e}")

def main():
    schedule.every(2).hours.do(lambda: asyncio.run(enviar_oferta()))
    asyncio.run(enviar_oferta())
    
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == '__main__':
    main()