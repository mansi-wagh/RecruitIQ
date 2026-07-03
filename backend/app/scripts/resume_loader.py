from pathlib import Path
import json
import sys
import time

# ==========================================================
# PROJECT PATHS
# ==========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]
BACKEND_ROOT = PROJECT_ROOT / "backend"

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.services.resume_parser import parse_resume
from app.services.resume_information_extractor import ResumeExtractor

# RESUME_FOLDER = (
#     PROJECT_ROOT
#     / "dataset"
#     / "Resume_dataset"
#     / "data"
#     # / "ENGINEERING"
#     # / "INFORMATION-TECHNOLOGY"
# )

OUTPUT_FOLDER = (
    PROJECT_ROOT
    / "backend"
    / "app"
    / "datasets"
)

OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_FOLDER / "parsed_resumes.json"

RESUME_SOURCE_ROOT = (
    PROJECT_ROOT
    / "dataset"
    / "Resume_dataset"
    / "data"
)

TECHNICAL_RESUME_CATEGORIES = (
    "ENGINEERING",
    "INFORMATION-TECHNOLOGY",
)

DEFAULT_RESUME_LIMIT = 180


def resolve_resume_category_folder(category):
    nested_folder = RESUME_SOURCE_ROOT / "data" / category
    direct_folder = RESUME_SOURCE_ROOT / category

    if nested_folder.exists():
        return nested_folder

    return direct_folder


def collect_technical_resume_files(limit):
    category_files = []

    for category in TECHNICAL_RESUME_CATEGORIES:
        folder = resolve_resume_category_folder(category)
        files = sorted(folder.rglob("*.pdf")) if folder.exists() else []
        category_files.append((category, folder, files))

    for category, folder, files in category_files:
        print(f"{category:<24}: {folder}")
        print(f"{'':<24}  PDF files: {len(files)}")

    ordered_files = []
    max_count = max((len(files) for _, _, files in category_files), default=0)

    for index in range(max_count):
        for category, _, files in category_files:
            if index < len(files):
                ordered_files.append((category, files[index]))

            if limit is not None and len(ordered_files) >= limit:
                return ordered_files

    return ordered_files


# ==========================================================
# LOAD RESUMES
# ==========================================================

def load_resumes(limit=DEFAULT_RESUME_LIMIT):

    resumes = []

    print("=" * 70)
    print("RecruitIQ Resume Loader")
    print("=" * 70)

    pdf_files = collect_technical_resume_files(limit)

    print(f"\nFound {len(pdf_files)} technical resumes\n")

    success = 0

    failed = 0

    start = time.time()

    for index, (category, pdf) in enumerate(pdf_files, start=1):

        print(f"[{index}/{len(pdf_files)}] {pdf.name}")

        try:

            resume_text = parse_resume(
                str(pdf)
            )

            extractor = ResumeExtractor(
                resume_text
            )

            resume_json = extractor.extract_all()

            resume_json["resume_name"] = pdf.name

            resume_json["resume_category"] = category

            resumes.append(resume_json)

            success += 1

        except Exception as e:

            failed += 1

            print(f"Failed : {pdf.name}")

            print(e)

    end = time.time()

    print("\n")

    print("=" * 70)

    print("Resume Parsing Completed")

    print("=" * 70)

    print(f"Successful : {success}")

    print(f"Failed     : {failed}")

    print(f"Time Taken : {round(end-start,2)} sec")

    return resumes


# ==========================================================
# SAVE JSON
# ==========================================================

def save_resumes(resumes):

    with open(

        OUTPUT_FILE,

        "w",

        encoding="utf-8"

    ) as file:

        json.dump(

            resumes,

            file,

            indent=4,

            ensure_ascii=False

        )

    print(f"\nSaved to\n{OUTPUT_FILE}")


# ==========================================================
# PUBLIC FUNCTION
# ==========================================================

def build_resume_dataset(limit=DEFAULT_RESUME_LIMIT):

    resumes = load_resumes(limit)

    save_resumes(resumes)

    return resumes


# ==========================================================
# MAIN
# ==========================================================

if __name__ == "__main__":

    resumes = build_resume_dataset(
        limit=DEFAULT_RESUME_LIMIT
    )

    print("\n")

    print("=" * 70)

    print(f"Total Parsed Resumes : {len(resumes)}")

    print("=" * 70)

    if resumes:

        from pprint import pprint

        print("\nSample Resume\n")

        pprint(resumes[0])
