import psycopg2
from fastapi import APIRouter, HTTPException
from database import get_connexion
from models.schemas import ClientCreer, ClientModifier

router = APIRouter()


def _serialiser_client(row, colonnes):
    client = dict(zip(colonnes, row))
    if client.get("date_naissance"):
        client["date_naissance"] = str(client["date_naissance"])
    if client.get("date_inscription"):
        client["date_inscription"] = str(client["date_inscription"])
    return client


@router.get("/")
def lister_clients():
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, nom, prenom, email, telephone, date_naissance, "
            "date_inscription, segment, actif, anonymise "
            "FROM clients ORDER BY id"
        )
        colonnes = [desc[0] for desc in cur.description]
        clients = [_serialiser_client(row, colonnes) for row in cur.fetchall()]
        return {"success": True, "data": clients, "message": f"{len(clients)} client(s) trouvé(s)"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.get("/{client_id}")
def obtenir_client(client_id: int):
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, nom, prenom, email, telephone, date_naissance, "
            "date_inscription, segment, actif, anonymise "
            "FROM clients WHERE id = %s",
            (client_id,),
        )
        colonnes = [desc[0] for desc in cur.description]
        ligne = cur.fetchone()
        if not ligne:
            raise HTTPException(status_code=404, detail="Client introuvable")
        return {"success": True, "data": _serialiser_client(ligne, colonnes), "message": "Client trouvé"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.post("/", status_code=201)
def creer_client(client: ClientCreer):
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO clients (nom, prenom, email, telephone, date_naissance) "
            "VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (client.nom, client.prenom, str(client.email), client.telephone, client.date_naissance),
        )
        client_id = cur.fetchone()[0]
        cur.execute(
            "INSERT INTO points (client_id, points_cumules, points_disponibles, points_utilises) "
            "VALUES (%s, 0, 0, 0)",
            (client_id,),
        )
        conn.commit()
        return {"success": True, "data": {"id": client_id}, "message": "Client créé avec succès"}
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(status_code=409, detail="Un client avec cet email existe déjà")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.put("/{client_id}")
def modifier_client(client_id: int, client: ClientModifier):
    conn = get_connexion()
    cur = conn.cursor()
    try:
        champs, valeurs = [], []
        if client.nom is not None:
            champs.append("nom = %s"); valeurs.append(client.nom)
        if client.prenom is not None:
            champs.append("prenom = %s"); valeurs.append(client.prenom)
        if client.email is not None:
            champs.append("email = %s"); valeurs.append(str(client.email))
        if client.telephone is not None:
            champs.append("telephone = %s"); valeurs.append(client.telephone)
        if client.date_naissance is not None:
            champs.append("date_naissance = %s"); valeurs.append(client.date_naissance)
        if client.actif is not None:
            champs.append("actif = %s"); valeurs.append(client.actif)

        if not champs:
            raise HTTPException(status_code=400, detail="Aucun champ à modifier")

        valeurs.append(client_id)
        cur.execute(
            f"UPDATE clients SET {', '.join(champs)} WHERE id = %s RETURNING id",
            valeurs,
        )
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Client introuvable")
        conn.commit()
        return {"success": True, "data": {"id": client_id}, "message": "Client mis à jour avec succès"}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
