import asyncio
import telegram
import schedule
import time
import random

TELEGRAM_TOKEN = 'SEU_TOKEN_DO_BOTFATHER'  # Pega no @BotFather
CANAL_ID = '@nomedoseucanal'  # Cria um canal e coloca o bot como admin

# 1. COLOCA SUAS OFERTAS AQUI
# Pra pegar: App Shopee Afiliados > Link de Conversão > Cola o link do produto > Gerar
OFERTAS = [
    {
        "nome": "Fone de Ouvido Bluetooth 5.3 TWS i12",
        "preco_original": "R$59,90",
        "preco": "R$29,90", 
        "desconto": "50% OFF",
        "link": "https://s.shopee.com.br/LjI1Jnkma",  # SEU LINK AQUI
        "imagem": "https://down-br.img.susercontent.com/file/br-11134207-7qukw-lkqg9h8g8g8g8g",
        "nota": "4.8",
        "cupom": "TECH10" # Opcional
    },
    {
        "nome": "Smartwatch D20 Y68 Bluetooth Relógio",
        "preco_original": "R$159,90",
        "preco": "R$79,90",
        "desconto": "50% OFF", 
        "link": "https://s.shopee.com.br/SEUOUTROLINK",
        "imagem": "https://down-br.img.susercontent.com/file/br-11134207-7qukw-xxxxxx",
        "nota": "4.6"
    },
    {
        "nome": "Caixa de Som Bluetooth JBL Go 3 Cópia",
        "preco_original": "R$99,90",
        "preco": "R$69,90",
        "desconto": "30% OFF",
        "link": "https://s.shopee.com.br/MAISUMLINK",
        "imagem": "https://down-br.img.susercontent.com/file/br-11134207-7qukw-yyyyyy", 
        "nota": "4.7",
        "cupom": ""
    },
    # Pode adicionar 20, 30 produtos aqui
]

async def enviar_oferta():
    bot = telegram.Bot(token=TELEGRAM_TOKEN)
    o = random.choice(OFERTAS)
    
    texto_cupom = f"\n🎟️ *CUPOM: `{o['cupom']}`*" if o.get('cupom') else ""
    
    texto = f"🧡 *ACHADINHO SHOPEE* 🧡\n\n" \
            f"*{o['nome']}*\n\n" \
            f"~~{o['preco_original']}~~\n" \
            f"💥 *Por: {o['preco']}* {o['desconto']}\n" \
            f"⭐ Nota: {o['nota']}/5.0{text_cupom}\n\n" \
            f"👉 [COMPRAR AGORA]({o['link']})\n\n" \
            f"🔥 Oferta por tempo limitado!\n" \
            f"_Link de afiliado - você não paga nada a mais por isso_"
    
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
    # Posta a cada 2 horas entre 8h e 23h
    schedule.every(2).hours.do(lambda: asyncio.run(enviar_oferta()))
    
    # Roda uma vez quando ligar
    print("Bot iniciado. Enviando primeira oferta...")
    asyncio.run(enviar_oferta())
    
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == '__main__':
    main()