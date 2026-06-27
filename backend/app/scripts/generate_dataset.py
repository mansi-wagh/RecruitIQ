import os
import pandas as pd

from app.services.resume_parser import parse_resume
from app.services.resume_information_extractor import ResumeExtractor
from app.services.job_description_parser import JobDescriptionParser
from app.services.matching_engine import MatchingEngine
from app.services.dataset_generator import DatasetGenerator


UPLOAD_FOLDER = "uploads/resumes"

OUTPUT_FILE = "app/datasets/matching_dataset.csv"


sample_jobs = [

"""
Python Backend Developer

Required Skills

Python

FastAPI

SQL

Docker

Experience: 2+ years

Education: Bachelor's Degree
""",

"""
Machine Learning Engineer

Required Skills

Python

Machine Learning

Scikit-learn

Pandas

NumPy

Experience: 1+ years

Education: Bachelor's Degree
""",

"""
Java Developer

Required Skills

Java

Spring Boot

MySQL

Git

Experience: 3+ years

Education: B.Tech
"""

]


generator = DatasetGenerator()

dataset = []


for filename in os.listdir(UPLOAD_FOLDER):

    if not filename.endswith(".pdf"):

        continue

    path = os.path.join(

        UPLOAD_FOLDER,

        filename

    )

    print(f"Processing {filename}")

    text = parse_resume(path)

    resume = ResumeExtractor(text).extract_all()

    for job_text in sample_jobs:

        job = JobDescriptionParser(

            job_text

        ).extract_all()

        engine = MatchingEngine(

            resume,

            job

        )

        result = engine.match()

        row = generator.create_record(

            resume,

            job,

            result

        )

        dataset.append(row)


df = pd.DataFrame(dataset)

df.to_csv(

    OUTPUT_FILE,

    index=False

)

print("Dataset Generated Successfully")