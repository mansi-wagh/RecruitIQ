from pathlib import Path
import json
import time

from app.services.resume_parser import parse_resume
from app.services.resume_information_extractor import ResumeExtractor


# ==========================================================
# PROJECT PATHS
# ==========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

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


# ==========================================================
# LOAD RESUMES
# ==========================================================

def load_resumes(limit=None):

    resumes = []

    engineering = (
        PROJECT_ROOT
        / "dataset"
        / "Resume_dataset"
        / "data"
        / "data"
        / "ENGINEERING"
    )

    it = (
        PROJECT_ROOT
        / "dataset"
        / "Resume_dataset"
        / "data"
        / "data"
        / "INFORMATION-TECHNOLOGY"
    )

    print("=" * 70)
    print("RecruitIQ Resume Loader")
    print("=" * 70)

    print(f"Engineering Folder : {engineering}")
    print(f"IT Folder          : {it}")

    if not engineering.exists():
        print("Engineering folder not found.")
        return resumes

    if not it.exists():
        print("IT folder not found.")
        return resumes

    pdf_files = []

    pdf_files.extend(engineering.rglob("*.pdf"))
    pdf_files.extend(it.rglob("*.pdf"))

    pdf_files = sorted(pdf_files)

    if limit is not None:

        pdf_files = pdf_files[:limit]

    print(f"\nFound {len(pdf_files)} resumes\n")

    success = 0

    failed = 0

    start = time.time()

    for index, pdf in enumerate(pdf_files, start=1):

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

def build_resume_dataset(limit=None):

    resumes = load_resumes(limit)

    save_resumes(resumes)

    return resumes


# ==========================================================
# MAIN
# ==========================================================

if __name__ == "__main__":

    resumes = build_resume_dataset(
        limit=70
    )

    print("\n")

    print("=" * 70)

    print(f"Total Parsed Resumes : {len(resumes)}")

    print("=" * 70)

    if resumes:

        from pprint import pprint

        print("\nSample Resume\n")

        pprint(resumes[0])