from fastapi import APIRouter, HTTPException
from database import get_connexion
from models.schemas import AjouterPoints, UtiliserPoints

router = APIRouter()


def _calculer_segment(points_cumules: int) -> str:
    if points_cumules >= 10000:
        return "PLATINUM"
    elif points_cumules >= 5000:
        return "GOLD"
    elif points_cumules >= 1000:
        return "SILVER"
    return "STANDARD"


@router.get("/{client_id}")
def solde_points(client_id: int):
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT p.points_cumules, p.points_disponibles, p.points_utilises, "
            "p.derniere_mise_a_jour, c.segment "
            "FROM points p JOIN clients c ON c.id = p.client_id "
            "WHERE p.client_id = %s",
            (client_id,),
        )
        ligne = cur.fetchone()
        if not ligne:
            raise HTTPException(status_code=404, detail="Client introuvable")
        data = {
            "points_cumules": ligne[0],
            "points_disponibles": ligne[1],
            "points_utilises": ligne[2],
            "derniere_mise_a_jour": str(ligne[3]),
            "segment": ligne[4],
        }
        return {"success": True, "data": data, "message": "Solde récupéré"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.post("/{client_id}/ajouter")
def ajouter_points(client_id: int, body: AjouterPoints):
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM clients WHERE id = %s", (client_id,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Client introuvable")

        cur.execute(
            "UPDATE points "
            "SET points_cumules = points_cumules + %s, "
            "    points_disponibles = points_disponibles + %s, "
            "    derniere_mise_a_jour = CURRENT_TIMESTAMP "
            "WHERE client_id = %s RETURNING points_cumules",
            (body.points, body.points, client_id),
        )
        nouveaux_cumules = cur.fetchone()[0]
        nouveau_segment = _calculer_segment(nouveaux_cumules)

        cur.execute("UPDATE clients SET segment = %s WHERE id = %s", (nouveau_segment, client_id))
        cur.execute(
            "INSERT INTO transactions (client_id, type, points, montant, description) "
            "VALUES (%s, 'ACHAT', %s, %s, %s)",
            (client_id, body.points, body.montant, body.description),
        )
        conn.commit()
        return {
            "success": True,
            "data": {
                "points_ajoutes": body.points,
                "points_cumules": nouveaux_cumules,
                "segment": nouveau_segment,
            },
            "message": f"{body.points} points ajoutés avec succès",
        }
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.post("/{client_id}/utiliser")
def utiliser_points(client_id: int, body: UtiliserPoints):
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute("SELECT points_disponibles FROM points WHERE client_id = %s", (client_id,))
        ligne = cur.fetchone()
        if not ligne:
            raise HTTPException(status_code=404, detail="Client introuvable")

        points_disponibles = ligne[0]
        if points_disponibles < body.points:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Points insuffisants — disponibles : {points_disponibles}, "
                    f"demandés : {body.points}"
                ),
            )

        cur.execute(
            "UPDATE points "
            "SET points_disponibles = points_disponibles - %s, "
            "    points_utilises = points_utilises + %s, "
            "    derniere_mise_a_jour = CURRENT_TIMESTAMP "
            "WHERE client_id = %s",
            (body.points, body.points, client_id),
        )
        cur.execute(
            "INSERT INTO transactions (client_id, type, points, description) "
            "VALUES (%s, 'UTILISATION', %s, %s)",
            (client_id, -body.points, body.description),
        )
        conn.commit()
        return {
            "success": True,
            "data": {
                "points_utilises": body.points,
                "points_restants": points_disponibles - body.points,
            },
            "message": f"{body.points} points utilisés avec succès",
        }
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.get("/{client_id}/transactions")
def historique_transactions(client_id: int):
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM clients WHERE id = %s", (client_id,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Client introuvable")
        cur.execute(
            "SELECT id, type, points, montant, description, date_transaction "
            "FROM transactions WHERE client_id = %s ORDER BY date_transaction DESC",
            (client_id,),
        )
        colonnes = [desc[0] for desc in cur.description]
        transactions = []
        for row in cur.fetchall():
            t = dict(zip(colonnes, row))
            if t.get("date_transaction"):
                t["date_transaction"] = str(t["date_transaction"])
            transactions.append(t)
        return {"success": True, "data": transactions, "message": f"{len(transactions)} transaction(s)"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
