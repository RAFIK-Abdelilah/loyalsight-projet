from fastapi import APIRouter, HTTPException
from database import get_connexion

router = APIRouter()

_SEGMENTS = {
    "STANDARD": {
        "couleur_principale":  "#4A90D9",
        "couleur_secondaire":  "#2980B9",
        "avantages": [
            "Accumulation de points a chaque achat",
            "Offres de bienvenue exclusives",
            "Acces au programme fidelite Picard",
        ],
        "prochaine": {"points_requis": 1000, "label": "Passage SILVER"},
    },
    "SILVER": {
        "couleur_principale":  "#7F8C8D",
        "couleur_secondaire":  "#95A5A6",
        "avantages": [
            "Livraison gratuite des 50 euros",
            "Offres exclusives membres Silver",
            "Points doubles le mois de votre anniversaire",
        ],
        "prochaine": {"points_requis": 5000, "label": "Passage GOLD"},
    },
    "GOLD": {
        "couleur_principale":  "#F5A623",
        "couleur_secondaire":  "#E67E22",
        "avantages": [
            "Livraison gratuite des 30 euros",
            "Acces aux ventes privees",
            "Cadeau anniversaire offert",
        ],
        "prochaine": {"points_requis": 10000, "label": "Passage PLATINUM"},
    },
    "PLATINUM": {
        "couleur_principale":  "#7B2FBE",
        "couleur_secondaire":  "#9B59B6",
        "avantages": [
            "Livraison gratuite sans minimum d'achat",
            "Acces VIP aux ventes privees",
            "Cadeau anniversaire premium",
            "Conseiller fidelite dedie",
        ],
        "prochaine": None,
    },
}


@router.get("/config/{client_id}")
def sdk_config(client_id: int):
    conn = get_connexion()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            SELECT c.nom, c.prenom, c.segment,
                   p.points_disponibles, p.points_cumules
            FROM clients c
            JOIN points p ON p.client_id = c.id
            WHERE c.id = %s AND c.actif = TRUE AND c.anonymise = FALSE
            """,
            (client_id,),
        )
        row = cur.fetchone()
    finally:
        cur.close()
        conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Client introuvable ou inactif")

    nom, prenom, segment, points_dispo, points_cum = row
    seg = _SEGMENTS.get(segment, _SEGMENTS["STANDARD"])

    prochaine = None
    if seg["prochaine"]:
        requis = seg["prochaine"]["points_requis"]
        prochaine = {
            "points_requis":  requis,
            "points_restants": max(0, requis - points_cum),
            "label": seg["prochaine"]["label"],
        }

    return {
        "success": True,
        "data": {
            "client": {
                "nom":               nom,
                "prenom":            prenom,
                "segment":           segment,
                "points_disponibles": points_dispo,
                "points_cumules":    points_cum,
            },
            "config": {
                "couleur_principale": seg["couleur_principale"],
                "couleur_secondaire": seg["couleur_secondaire"],
                "texte_bienvenue":   f"Bonjour {prenom}, vous etes membre {segment}",
                "texte_points":      f"Vous avez {points_dispo} points disponibles",
                "avantages":         seg["avantages"],
                "prochaine_recompense": prochaine,
            },
        },
        "message": "Configuration SDK generee",
    }
