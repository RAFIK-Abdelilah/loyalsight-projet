import os
import datetime
import decimal
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from database import get_connexion
from prompts import SYSTEM_PROMPT

load_dotenv()
router = APIRouter()


class AgentQuery(BaseModel):
    question: str


def _serialiser(val):
    if val is None:
        return None
    if isinstance(val, (datetime.date, datetime.datetime)):
        return str(val)
    if isinstance(val, decimal.Decimal):
        return float(val)
    return val


@router.post("/query")
def agent_query(body: AgentQuery):
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    try:
        reponse = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": body.question},
            ],
            temperature=0,
        )
        sql = reponse.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Erreur Groq : {str(e)}")

    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute(sql)
        if cur.description is None:
            resultats = []
        else:
            colonnes = [desc[0] for desc in cur.description]
            lignes = cur.fetchall()
            resultats = [
                {col: _serialiser(val) for col, val in zip(colonnes, ligne)}
                for ligne in lignes
            ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur SQL : {str(e)}")
    finally:
        cur.close()
        conn.close()

    return {
        "success": True,
        "question": body.question,
        "sql": sql,
        "resultat": resultats,
        "message": "Requête exécutée avec succès",
    }
