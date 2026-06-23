import os
import psycopg2
from groq import Groq
from dotenv import load_dotenv
from prompts import SYSTEM_PROMPT

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../backend/.env"))

client_ia = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generer_sql(instruction: str) -> str:
    reponse = client_ia.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": instruction},
        ],
        temperature=0,
    )
    return reponse.choices[0].message.content.strip()


def executer_sql(requete: str) -> list[dict]:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", 5432)),
        dbname=os.getenv("DB_NAME", "loyalsight"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres"),
    )
    cur = conn.cursor()
    try:
        cur.execute(requete)
        colonnes = [desc[0] for desc in cur.description]
        lignes = cur.fetchall()
        return [dict(zip(colonnes, ligne)) for ligne in lignes]
    finally:
        cur.close()
        conn.close()


def afficher_resultats(resultats: list[dict]):
    if not resultats:
        print("Aucun résultat.")
        return
    colonnes = list(resultats[0].keys())
    largeurs = {col: max(len(col), max(len(str(r[col])) for r in resultats)) for col in colonnes}
    separateur = "+-" + "-+-".join("-" * largeurs[col] for col in colonnes) + "-+"
    entete    = "| " + " | ".join(col.ljust(largeurs[col]) for col in colonnes) + " |"
    print(separateur)
    print(entete)
    print(separateur)
    for ligne in resultats:
        print("| " + " | ".join(str(ligne[col]).ljust(largeurs[col]) for col in colonnes) + " |")
    print(separateur)
    print(f"\n{len(resultats)} résultat(s)\n")


def run():
    print("=" * 60)
    print("  LoyalSight — Agent SQL (Groq llama-3.3-70b-versatile)")
    print("  Tapez 'quitter' pour arrêter")
    print("=" * 60)

    while True:
        try:
            instruction = input("\nInstruction : ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nFin de session.")
            break

        if instruction.lower() in ("quitter", "exit", "quit"):
            print("Au revoir.")
            break

        if not instruction:
            continue

        print("\nGénération de la requête SQL...")
        requete = generer_sql(instruction)
        print(f"\nSQL généré :\n  {requete}\n")

        print("Exécution...")
        try:
            resultats = executer_sql(requete)
            afficher_resultats(resultats)
        except Exception as e:
            print(f"Erreur lors de l'exécution : {e}")


if __name__ == "__main__":
    run()
