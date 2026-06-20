from fastapi import APIRouter, HTTPException
from database import get_connexion

router = APIRouter()


@router.post("/anonymiser/{client_id}")
def anonymiser_client(client_id: int):
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, anonymise FROM clients WHERE id = %s", (client_id,))
        client = cur.fetchone()
        if not client:
            raise HTTPException(status_code=404, detail="Client introuvable")
        if client[1]:
            raise HTTPException(status_code=400, detail="Ce client est déjà anonymisé")

        cur.execute(
            "UPDATE clients "
            "SET nom = 'ANONYME', prenom = 'ANONYME', email = %s, "
            "    telephone = NULL, date_naissance = NULL, "
            "    anonymise = TRUE, actif = FALSE "
            "WHERE id = %s",
            (f"anonyme_{client_id}@supprime.com", client_id),
        )
        cur.execute(
            "INSERT INTO demandes_rgpd (client_id, type_demande, statut, date_traitement) "
            "VALUES (%s, 'SUPPRESSION', 'TRAITE', CURRENT_TIMESTAMP)",
            (client_id,),
        )
        conn.commit()
        return {
            "success": True,
            "data": {"client_id": client_id},
            "message": "Client anonymisé avec succès",
        }
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.get("/demandes")
def lister_demandes():
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, client_id, type_demande, statut, date_demande, date_traitement "
            "FROM demandes_rgpd ORDER BY date_demande DESC"
        )
        colonnes = [desc[0] for desc in cur.description]
        demandes = []
        for row in cur.fetchall():
            d = dict(zip(colonnes, row))
            if d.get("date_demande"):
                d["date_demande"] = str(d["date_demande"])
            if d.get("date_traitement"):
                d["date_traitement"] = str(d["date_traitement"])
            demandes.append(d)
        return {
            "success": True,
            "data": demandes,
            "message": f"{len(demandes)} demande(s) trouvée(s)",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@router.get("/qualite")
def qualite_donnees():
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM vue_qualite_donnees")
        colonnes = [desc[0] for desc in cur.description]
        ligne = cur.fetchone()
        if not ligne:
            return {"success": True, "data": {}, "message": "Aucune donnée disponible"}
        return {
            "success": True,
            "data": dict(zip(colonnes, ligne)),
            "message": "Qualité des données récupérée",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
