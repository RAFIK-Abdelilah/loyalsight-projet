from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class ClientCreer(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    telephone: Optional[str] = None
    date_naissance: Optional[date] = None


class ClientModifier(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None
    date_naissance: Optional[date] = None
    actif: Optional[bool] = None


class AjouterPoints(BaseModel):
    points: int
    montant: Optional[float] = None
    description: Optional[str] = "Achat en magasin"


class UtiliserPoints(BaseModel):
    points: int
    description: Optional[str] = "Utilisation de points"
