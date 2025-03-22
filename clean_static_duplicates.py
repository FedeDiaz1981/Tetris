import os
from collections import defaultdict

# Configura la raíz donde están tus archivos estáticos por app
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_SEARCH_DIR = BASE_DIR  # Escanea todo el proyecto
STATIC_FOLDER_NAME = "static"

# Ruta relativa destino final simulada (como Django los vería)
found_files = defaultdict(list)

for root, dirs, files in os.walk(STATIC_SEARCH_DIR):
    if STATIC_FOLDER_NAME in root.split(os.sep):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path_index = root.split(os.sep).index(STATIC_FOLDER_NAME)
            relative_root = os.sep.join(root.split(os.sep)[rel_path_index + 1:])
            target_path = os.path.join(relative_root, file).replace("\\", "/")
            found_files[target_path].append(full_path)

# Mostrar duplicados
print("\n🔍 Archivos estáticos duplicados encontrados:\n")
duplicates = {k: v for k, v in found_files.items() if len(v) > 1}

if not duplicates:
    print("✅ No se encontraron archivos duplicados.\n")
else:
    for path, files in duplicates.items():
        print(f"❗ {path}:")
        for i, f in enumerate(files, 1):
            print(f"   [{i}] {f}")
    print("\n⚠️ Django solo usará el PRIMERO de cada uno (los demás serán ignorados).")

    confirm = input("\n¿Deseas eliminar todos los duplicados excepto el primero? (s/n): ").lower()
    if confirm == 's':
        for files in duplicates.values():
            for f in files[1:]:
                print(f"🗑 Eliminando: {f}")
                os.remove(f)
        print("\n✅ Archivos duplicados eliminados.")
    else:
        print("\n⏹ Operación cancelada. No se eliminaron archivos.")
