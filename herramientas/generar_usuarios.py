"""Genera erp/assets/js/usuarios.js a partir del Excel de control de acceso.

Uso (desde la raíz del repositorio):
    python3 herramientas/generar_usuarios.py ruta/usuarios.xlsx

El Excel debe tener los encabezados: Modulo | Usuario | Password.
Las contraseñas NO se guardan en texto: se guarda una huella PBKDF2-SHA256
con sal aleatoria. Son contraseñas temporales; el sistema obliga a cambiarlas
en el primer acceso. No subas el Excel al repositorio.
"""
import hashlib
import json
import secrets
import sys
import unicodedata
from pathlib import Path

import openpyxl

ITERACIONES = 210_000
# Encabezados de área válidos en la columna Modulo (sin importar acentos ni mayúsculas).
AREAS = {
    "TI", "OPERACIONES", "FINANZAS", "MANTENIMIENTO", "COMPRAS", "GERENCIAL",
    "GESTORIA", "SERVICIO MEDICO", "MONITOREO", "SERVICIO AL CLIENTE",
    "TORRE DE CONTROL", "ALMACEN REFACCIONES", "CONTROL DE COMBUSTIBLE", "RECURSOS HUMANOS",
}
SINONIMOS = {
    "ALMACEN DE REFACCIONES": "ALMACEN REFACCIONES",
    "CONTROL COMBUSTIBLE": "CONTROL DE COMBUSTIBLE",
    "COMBUSTIBLE": "CONTROL DE COMBUSTIBLE",
    "RH": "RECURSOS HUMANOS",
}
AREAS_ADMIN = {"TI"}  # administran el ERP: ven todas las áreas y la gestión de usuarios
SALIDA = Path(__file__).resolve().parent.parent / "erp" / "assets" / "js" / "usuarios.js"


def normalizar_area(texto) -> str:
    sin_acentos = unicodedata.normalize("NFD", str(texto or "")).encode("ascii", "ignore").decode()
    area = " ".join(sin_acentos.upper().split())
    return SINONIMOS.get(area, area)


def huella(password: str) -> dict:
    sal = secrets.token_bytes(16)
    h = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), sal, ITERACIONES)
    return {"sal": sal.hex(), "hash": h.hex()}


def leer_excel(ruta: str) -> list[dict]:
    hoja = openpyxl.load_workbook(ruta, data_only=True).active
    filas = [[c for c in fila] for fila in hoja.iter_rows(values_only=True)]
    for i, fila in enumerate(filas):
        normal = [str(c).strip().lower() if c is not None else "" for c in fila]
        if "usuario" in normal and "password" in normal and "modulo" in normal:
            col = {nombre: normal.index(nombre) for nombre in ("modulo", "usuario", "password")}
            break
    else:
        sys.exit("No encontré los encabezados Modulo / Usuario / Password.")

    usuarios, vistos = [], set()
    for fila in filas[i + 1:]:
        usuario = fila[col["usuario"]]
        if usuario is None or str(usuario).strip() == "":
            continue
        usuario = str(usuario).strip().lower()
        area = normalizar_area(fila[col["modulo"]])
        password = fila[col["password"]]
        if area not in AREAS:
            sys.exit(f"Área desconocida '{area}' para el usuario {usuario}.")
        if password is None or str(password).strip() == "":
            sys.exit(f"El usuario {usuario} no tiene contraseña.")
        if usuario in vistos:
            sys.exit(f"Usuario repetido: {usuario}.")
        vistos.add(usuario)
        if isinstance(password, float) and password.is_integer():
            password = int(password)
        usuarios.append({
            "usuario": usuario,
            "area": area.lower().replace(" ", "-"),  # id del área en el ERP, p. ej. servicio-medico
            "rol": "admin" if area in AREAS_ADMIN else "usuario",
            **huella(str(password).strip()),
        })
    return usuarios


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    usuarios = leer_excel(sys.argv[1])
    lineas = ",\n".join("  " + json.dumps(u, ensure_ascii=False) for u in usuarios)
    SALIDA.write_text(
        "// Generado por herramientas/generar_usuarios.py — no editar a mano.\n"
        "// Contraseñas temporales guardadas como huella PBKDF2-SHA256; se cambian en el primer acceso.\n"
        f"const ITERACIONES_PBKDF2 = {ITERACIONES};\n"
        f"const USUARIOS = [\n{lineas},\n];\n",
        encoding="utf-8",
    )
    print(f"{len(usuarios)} usuarios escritos en {SALIDA}")


if __name__ == "__main__":
    main()
